import Groq from "groq-sdk";
import { logError } from "../utils/logger.js";

let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing");
    }

    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groqClient;
};

const DEFAULT_TEXT_MODEL =
  process.env.GROQ_TEXT_MODEL_ID || "llama-3.3-70b-versatile";

const extractGroqText = (response) => {
  const content = response?.choices?.[0]?.message?.content;

  if (Array.isArray(content)) {
    return content
      .map((part) => part?.text || part?.content || "")
      .join("")
      .trim();
  }

  return String(content || "").trim();
};

const generateGroqText = async ({
  prompt,
  maxTokens = 700,
  temperature = 0.7,
  topP = 0.9,
  system = "You are a helpful assistant.",
  model = DEFAULT_TEXT_MODEL,
}) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing");
  }

  const response = await getGroqClient().chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: prompt },
    ],
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
  });

  const text = extractGroqText(response);

  if (!text) {
    throw new Error("Groq did not return any text");
  }

  return text;
};

export const generateTextFromAI = async ({
  prompt,
  maxTokens = 700,
  temperature = 0.7,
  topP = 0.9,
}) => {
  try {
    return await generateGroqText({
      prompt,
      maxTokens,
      temperature,
      topP,
    });
  } catch (error) {
    logError("Groq text generation failed", error, {
      modelId: DEFAULT_TEXT_MODEL,
      promptPreview: prompt?.slice(0, 300),
    });
    throw error;
  }
};

export const generateContentFromAI = async ({
  topic,
  platform,
  niche,
  promptType,
}) => {
  const prompt = `
You are an expert content creator.

Generate content for:
Topic: ${topic}
Platform: ${platform}
Niche: ${niche}
Style: ${promptType}

Return ONLY valid JSON in this format:
{
  "hook": "",
  "script": "",
  "title": "",
  "description": "",
  "hashtags": []
}
`;

  return generateTextFromAI({
    prompt,
    maxTokens: 700,
    temperature: 0.7,
    topP: 0.9,
  });
};
