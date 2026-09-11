import Project from "../../models/Project.js";
import {
  generateContentFromAI,
  generateTextFromAI,
} from "../../services/aiService.js";
import { logError } from "../../utils/logger.js";

const parseAiJson = (raw) => {
  let cleaned = String(raw || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON found in AI response");
  }

  cleaned = match[0];
  return JSON.parse(cleaned);
};

const normalizeContent = (content) => ({
  title: String(content?.title || "").trim(),
  hook: String(content?.hook || "").trim(),
  description: String(content?.description || "").trim(),
  script: String(content?.script || "").trim(),
  hashtags: Array.isArray(content?.hashtags)
    ? content.hashtags.map((tag) => String(tag).trim()).filter(Boolean)
    : String(content?.hashtags || "")
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter(Boolean),
});

export const generateContent = async (req, res) => {
  try {
    const { topic, platform, niche, promptType } = req.body;

    if (!topic || !platform || !niche || !promptType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const aiResponse = await generateContentFromAI({
      topic,
      platform,
      niche,
      promptType,
    });

    try {
      const parsed = normalizeContent(parseAiJson(aiResponse));
      return res.json(parsed);
    } catch (error) {
      logError("AI response parse failed", error, {
        rawResponsePreview: String(aiResponse).slice(0, 500),
      });
      throw new Error("Invalid AI response format");
    }
  } catch (error) {
    logError("Content generation failed", error, {
      userId: req.user?._id?.toString?.(),
      route: req.originalUrl,
      method: req.method,
      payload: {
        topic: req.body?.topic || "",
        platform: req.body?.platform || "",
        niche: req.body?.niche || "",
        promptType: req.body?.promptType || "",
      },
    });

    const status =
      Number.isInteger(error?.statusCode) && error.statusCode >= 400
        ? error.statusCode
        : 500;

    return res.status(status).json({
      message: error?.message || "AI generation failed",
      details: error?.details,
    });
  }
};

export const refineContent = async (req, res) => {
  try {
    const {
      currentContent,
      userMessage,
      history = [],
      topic,
      platform,
      niche,
      targetField = "script",
    } = req.body;

    if (!currentContent || !userMessage) {
      return res
        .status(400)
        .json({ message: "currentContent and userMessage are required" });
    }

    const safeHistory = Array.isArray(history) ? history.slice(-8) : [];
    const editableFields = [
      "script",
      "hook",
      "title",
      "description",
      "hashtags",
    ];
    const selectedField = editableFields.includes(targetField)
      ? targetField
      : "script";
    const normalizedCurrent = normalizeContent(currentContent);

    const prompt = `
You are editing social content with a user in chat.

Current content:
${JSON.stringify(normalizedCurrent, null, 2)}

Context:
- Topic: ${topic || "N/A"}
- Platform: ${platform || "N/A"}
- Niche: ${niche || "N/A"}

Edit target:
- ONLY modify this field: ${selectedField}
- Keep all other fields unchanged
- If target is hashtags, return array of hashtag strings.

Recent conversation:
${safeHistory
  .map((m) => `- ${m.role === "user" ? "User" : "Assistant"}: ${m.text || ""}`)
  .join("\n")}

Latest user instruction:
${userMessage}

Return ONLY valid JSON in this exact shape:
{
  "assistantMessage": "Short response explaining what you changed",
  "content": {
    "title": "string",
    "hook": "string",
    "description": "string",
    "script": "string",
    "hashtags": ["#tag1", "#tag2"]
  }
}
`;

    const aiResponse = await generateTextFromAI({
      prompt,
      maxTokens: 900,
      temperature: 0.5,
      topP: 0.9,
    });

    let parsed;
    try {
      parsed = parseAiJson(aiResponse);
    } catch (error) {
      logError("AI refine response parse failed", error, {
        rawResponsePreview: String(aiResponse).slice(0, 500),
      });
      throw new Error("Invalid AI refine response format");
    }

    const assistantMessage = String(parsed?.assistantMessage || "").trim();
    const candidate = normalizeContent(parsed?.content || {});
    const content = {
      ...normalizedCurrent,
      [selectedField]: candidate[selectedField],
    };

    return res.json({
      assistantMessage:
        assistantMessage ||
        "Updated. Review and ask for more changes if needed.",
      content,
    });
  } catch (error) {
    logError("Content refinement failed", error, {
      userId: req.user?._id?.toString?.(),
      route: req.originalUrl,
      method: req.method,
    });

    const status =
      Number.isInteger(error?.statusCode) && error.statusCode >= 400
        ? error.statusCode
        : 500;

    return res.status(status).json({
      message: error?.message || "Content refinement failed",
      details: error?.details,
    });
  }
};

export const saveContentToProject = async (req, res) => {
  try {
    const { projectId, createNew, content, topic, platform, niche } = req.body;

    if (!content) {
      return res.status(400).json({ message: "content is required" });
    }

    const normalized = normalizeContent(content);

    let targetProject = null;

    if (projectId) {
      targetProject = await Project.findOne({
        _id: projectId,
        user: req.user._id,
      });

      if (!targetProject) {
        return res.status(404).json({ message: "Project not found" });
      }
    } else if (createNew === true) {
      targetProject = await Project.create({
        user: req.user._id,
        status: "draft",
      });
    } else {
      return res
        .status(400)
        .json({ message: "projectId or createNew=true is required" });
    }

    targetProject.topic = topic || targetProject.topic || "";
    targetProject.platform = platform || targetProject.platform || "";
    targetProject.niche = niche || targetProject.niche || "";
    targetProject.title = normalized.title;
    targetProject.hook = normalized.hook;
    targetProject.description = normalized.description;
    targetProject.script = normalized.script;
    targetProject.hashtags = normalized.hashtags;
    targetProject.status = "draft";

    await targetProject.save();

    return res.json(targetProject);
  } catch (error) {
    logError("Save refined content failed", error, {
      userId: req.user?._id?.toString?.(),
      route: req.originalUrl,
      method: req.method,
    });

    const status =
      Number.isInteger(error?.statusCode) && error.statusCode >= 400
        ? error.statusCode
        : 500;

    return res.status(status).json({
      message: error?.message || "Failed to save content",
      details: error?.details,
    });
  }
};
