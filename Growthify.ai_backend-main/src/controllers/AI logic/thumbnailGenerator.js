import { generateTextFromAI } from "../../services/aiService.js";
import { generateThumbnailImage } from "../../services/thumbnailService.js";
import Project from "../../models/Project.js";
import { logError } from "../../utils/logger.js";
import axios from "axios";

export const generateThumbnail = async (req, res) => {
  try {
    const {
      projectId,
      createNew,
      title,
      mood,
      colorPreference,
      userDescription,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // ======================================
    // STEP 1 — Prompt Engineering (Titan Text)
    // ======================================

    const promptEngineeringInput = `
You are an expert YouTube thumbnail prompt engineer.

Convert the following structured inputs into one detailed image generation prompt.
Your job is to turn loose keywords into a concrete visual scene, not a list of symbols.

Title: ${title}
Mood: ${mood || "Dramatic"}
Color Preference: ${colorPreference || "High contrast"}
Additional Description: ${userDescription || "None"}

Requirements:
- Describe one clear focal subject.
- Describe one specific background or location.
- Include 2-3 supporting visual objects that explain the topic.
- Use cinematic lighting, strong depth, sharp details, and professional YouTube news thumbnail composition.
- Use a 16:9 aspect ratio with a clean foreground/background separation.
- Do not simply draw flags, logos, random icons, or abstract keyword symbols.
- Do not include readable text, captions, labels, watermarks, or typography inside the image.
- Avoid distorted faces, distorted hands, messy flags, cluttered layouts, and random extra symbols.

Return ONLY the final image generation prompt.
`;

    const enhancedPrompt = await generateTextFromAI({
      prompt: promptEngineeringInput,
      maxTokens: 300,
      temperature: 0.7,
      topP: 0.9,
    });

    // ======================================
    // STEP 2 — Generate Image (Titan Image → S3)
    // ======================================

    const { thumbnailUrl: imageUrl, promptUsed } = await generateThumbnailImage(
      enhancedPrompt,
      {
        title,
        mood,
        colorPreference,
        userDescription,
      },
    );

    // ======================================
    // STEP 3 — Project Handling Logic
    // ======================================

    let targetProject = null;

    // Case 1 — Update existing project
    if (projectId) {
      targetProject = await Project.findOne({
        _id: projectId,
        user: req.user._id,
      });

      if (!targetProject) {
        return res.status(404).json({ message: "Project not found" });
      }
    }

    // Case 2 — Create new project
    else if (createNew === true) {
      targetProject = await Project.create({
        user: req.user._id,
        status: "draft",
      });
    }

    // Save thumbnail to project
    if (targetProject) {
      targetProject.thumbnailUrl = imageUrl;
      targetProject.title = title;
      targetProject.status = "draft";

      await targetProject.save();

      return res.json(targetProject);
    }

    // Case 3 — Just return thumbnail
    return res.json({
      thumbnailUrl: imageUrl,
      promptUsed,
    });
  } catch (error) {
    logError("Thumbnail generation failed", error, {
      userId: req.user?._id?.toString?.(),
      route: req.originalUrl,
      method: req.method,
      payload: {
        projectId: req.body?.projectId || null,
        title: req.body?.title || "",
      },
    });

    const status =
      Number.isInteger(error?.statusCode) && error.statusCode >= 400
        ? error.statusCode
        : 500;

    res.status(status).json({
      message: error?.message || "Thumbnail generation failed",
      details: error?.details,
    });
  }
};

export const downloadThumbnail = async (req, res) => {
  try {
    const { url, title } = req.query;

    if (!url) {
      return res.status(400).json({ message: "Thumbnail URL is required" });
    }

    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ message: "Invalid thumbnail URL" });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res
        .status(400)
        .json({ message: "Only HTTP/HTTPS URLs are allowed" });
    }

    const response = await axios.get(url, { responseType: "stream" });
    const contentType = response.headers["content-type"] || "image/png";
    const safeTitle = (title || "Thumbnail").replace(/[\\/:*?"<>|]/g, "_");

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="GrowthSync_${safeTitle}.png"`,
    );

    response.data.pipe(res);
  } catch (error) {
    logError("Thumbnail download failed", error, {
      userId: req.user?._id?.toString?.(),
      route: req.originalUrl,
      method: req.method,
      payload: {
        url: req.query?.url || "",
      },
    });

    res.status(500).json({ message: "Failed to download thumbnail" });
  }
};
