import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import { logError, logWarn } from "../utils/logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const CLOUDFLARE_IMAGE_MODEL =
  process.env.CLOUDFLARE_IMAGE_MODEL || "@cf/black-forest-labs/flux-1-schnell";
const CLOUDFLARE_IMAGE_STEPS = Math.min(
  Number(process.env.CLOUDFLARE_IMAGE_STEPS || 4),
  8,
);
const CLOUDFLARE_PROMPT_MAX_LENGTH = 2048;

const blockedTerms = [
  "blood",
  "gore",
  "weapon",
  "gun",
  "knife",
  "violent",
  "nude",
  "nudity",
  "nsfw",
  "hate",
  "drugs",
];

const sanitizePrompt = (input) => {
  let cleaned = String(input || "");

  for (const term of blockedTerms) {
    cleaned = cleaned.replace(new RegExp(`\\b${term}\\b`, "gi"), "");
  }

  return cleaned
    .replace(/\s+/g, " ")
    .replace(/[^\x20-\x7E]/g, "")
    .trim()
    .slice(0, CLOUDFLARE_PROMPT_MAX_LENGTH);
};

const isContentFilterError = (error) => {
  const text = `${error?.name || ""} ${error?.message || ""}`.toLowerCase();
  return (
    text.includes("content filter") ||
    text.includes("blocked") ||
    text.includes("safety") ||
    text.includes("unsafe") ||
    text.includes("finishreason") ||
    text.includes("finish reason")
  );
};

const buildPromptAttempts = (prompt, options = {}) => {
  const safeTitle = sanitizePrompt(options?.title || "YouTube growth strategy");
  const safeMood = sanitizePrompt(options?.mood || "cinematic");
  const safeColors = sanitizePrompt(options?.colorPreference || "high contrast");
  const safeDescription = sanitizePrompt(options?.userDescription || "");
  const variationTag = uuidv4().slice(0, 8);
  const originalPrompt = sanitizePrompt(prompt);
  const fallbackPrompt1 = `Create a professional 16:9 YouTube news thumbnail scene about ${safeTitle}. Show one clear focal subject in the foreground, a specific real-world setting in the background, and 2-3 supporting objects that explain the topic. Use ${safeMood} mood, ${safeColors}, cinematic lighting, sharp detail, clean composition, no readable text, no logos, no messy flags, no random symbols, no clutter, variation ${variationTag}.`;
  const fallbackPrompt2 = `Concrete thumbnail image for this topic: ${safeTitle}. ${safeDescription || "Translate the topic into a specific visual story instead of generic symbols."} Composition: clear foreground subject, meaningful background, a few relevant objects, professional news thumbnail style, high clarity, safe non-violent imagery, no text overlay, no distorted faces, no distorted hands, variation ${variationTag}.`;

  return [originalPrompt, fallbackPrompt1, fallbackPrompt2].filter(Boolean);
};

const getCloudflareImageConfig = () => {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !apiToken) {
    throw new Error("Cloudflare Workers AI environment variables are missing");
  }

  return { accountId, apiToken };
};

const extractBase64FromCloudflareResponse = (responseJSON) => {
  const image =
    responseJSON?.result?.image ||
    responseJSON?.image ||
    responseJSON?.result?.images?.[0];

  if (!image) {
    return null;
  }

  return String(image).replace(/^data:image\/\w+;base64,/, "");
};

const invokeCloudflareFluxImage = async (prompt) => {
  const { accountId, apiToken } = getCloudflareImageConfig();
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${CLOUDFLARE_IMAGE_MODEL}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      steps: CLOUDFLARE_IMAGE_STEPS,
      seed: Math.floor(Math.random() * 2147483647),
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Cloudflare Workers AI Error: ${responseText}`);
  }

  let responseJSON;
  try {
    responseJSON = JSON.parse(responseText);
  } catch {
    throw new Error("Cloudflare Workers AI returned invalid JSON");
  }

  const base64Data = extractBase64FromCloudflareResponse(responseJSON);
  if (!base64Data) {
    throw new Error("Cloudflare Workers AI did not return image data");
  }

  return {
    base64Data,
    mimeType: "image/jpeg",
  };
};

const uploadToCloudinary = async (base64Data, mimeType = "image/png") => {
  if (
    !process.env.CLOUD_NAME ||
    !process.env.CLOUD_API_KEY ||
    !process.env.CLOUD_API_SECRET
  ) {
    throw new Error("Cloudinary environment variables are missing");
  }

  const base64Image = `data:${mimeType};base64,${base64Data}`;
  const uploadResponse = await cloudinary.uploader.upload(base64Image, {
    folder: "growthsync",
  });

  if (!uploadResponse?.secure_url) {
    throw new Error("Cloudinary upload did not return a secure URL");
  }

  return uploadResponse.secure_url;
};

export const generateThumbnailImage = async (prompt, options = {}) => {
  const attempts = buildPromptAttempts(prompt, options);
  let lastError = null;
  let promptUsed = attempts[0];

  for (let index = 0; index < attempts.length; index += 1) {
    const candidate = attempts[index];
    promptUsed = candidate;

    try {
      const { base64Data, mimeType } = await invokeCloudflareFluxImage(candidate);
      const thumbnailUrl = await uploadToCloudinary(base64Data, mimeType);

      return {
        thumbnailUrl,
        promptUsed,
      };
    } catch (error) {
      lastError = error;

      if (index < attempts.length - 1) {
        logWarn("Cloudflare Flux thumbnail generation failed; trying fallback prompt", {
          attempt: index + 1,
          modelId: CLOUDFLARE_IMAGE_MODEL,
          errorMessage: error?.message,
        });
      }

      if (isContentFilterError(error)) {
        continue;
      }
    }
  }

  logError("All thumbnail generation attempts failed", lastError, {
    modelId: CLOUDFLARE_IMAGE_MODEL,
    promptPreview: String(prompt || "").slice(0, 300),
  });

  throw lastError || new Error("Thumbnail generation failed");
};
