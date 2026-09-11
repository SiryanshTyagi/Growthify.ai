import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2, Sparkles, Send, Save } from "lucide-react";
import { C, font } from "../../theme/theme.js";
import styles from "./ContentGenerator.module.css";
import useProjects from "../../hooks/useProjects.js";

const promptTypes = [
  "Storytelling",
  "Educational",
  "Controversial",
  "Listicle",
  "Short-form",
];

const tabs = [
  { key: "script", label: "Script" },
  { key: "hook", label: "Hook" },
  { key: "title", label: "Title" },
  { key: "description", label: "Caption" },
  { key: "hashtags", label: "Hashtags" },
];
const TAB_KEYS = tabs.map((t) => t.key);

const normalizeHashtags = (hashtags) => {
  if (Array.isArray(hashtags)) return hashtags;
  return String(hashtags || "")
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter(Boolean);
};

const ContentGenerator = ({ linkedProjectId = "", generatorData = {}, onDataUsed = () => {} }) => {
  const [formData, setFormData] = useState({
    topic: generatorData.topic || "",
    platform: generatorData.platform || "youtube",
    niche: "",
    promptType: "Storytelling",
  });
  const [saveMode, setSaveMode] = useState("new");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [activeTab, setActiveTab] = useState("script");
  const [chatInputByTab, setChatInputByTab] = useState(() =>
    Object.fromEntries(TAB_KEYS.map((key) => [key, ""])),
  );
  const [chatMessagesByTab, setChatMessagesByTab] = useState(() =>
    Object.fromEntries(TAB_KEYS.map((key) => [key, []])),
  );

  const { projects, loading: projectsLoading, fetchProjects } = useProjects();
  const isLinkedMode = Boolean(linkedProjectId);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!linkedProjectId) return;
    setSaveMode("existing");
    setSelectedProjectId(linkedProjectId);
  }, [linkedProjectId]);

  useEffect(() => {
    if (isInitialized.current) return;
    if (!generatorData.topic && !generatorData.platform) return;

    isInitialized.current = true;
    setFormData((prev) => {
      let normalizedPlatform = generatorData.platform || prev.platform;
      if (normalizedPlatform) {
        normalizedPlatform = normalizedPlatform.toLowerCase();
      }

      return {
        ...prev,
        topic: generatorData.topic || prev.topic,
        platform: normalizedPlatform || prev.platform,
      };
    });
    onDataUsed();
  }, [generatorData.topic, generatorData.platform, onDataUsed]);

  const displayTitle = useMemo(() => {
    if (!generated?.title) return "Generated Content";
    return generated.title;
  }, [generated]);
  const activeTabLabel = tabs.find((t) => t.key === activeTab)?.label || "Script";
  const activeChatInput = chatInputByTab[activeTab] || "";
  const activeChatMessages = chatMessagesByTab[activeTab] || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsGenerating(true);
    try {
      const payload = {
        topic: formData.topic,
        platform: formData.platform,
        niche: formData.niche,
        promptType: formData.promptType,
      };

      const response = await axios.post("/api/ai/generate-content", payload);
      const content = {
        ...response.data,
        hashtags: normalizeHashtags(response.data?.hashtags),
      };

      setGenerated(content);
      setChatInputByTab(Object.fromEntries(TAB_KEYS.map((key) => [key, ""])));
      setChatMessagesByTab(
        Object.fromEntries(
          tabs.map((tab) => [
            tab.key,
            [
              {
                role: "assistant",
                text: `I generated your ${tab.label.toLowerCase()} draft. Tell me what to change.`,
              },
            ],
          ]),
        ),
      );
      setActiveTab("script");
      toast.success("Content generated. Refine it in chat, then save.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Content generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefine = async () => {
    if (!activeChatInput.trim() || !generated) return;

    const userText = activeChatInput.trim();
    setChatInputByTab((prev) => ({ ...prev, [activeTab]: "" }));

    const nextMessages = [...activeChatMessages, { role: "user", text: userText }];
    setChatMessagesByTab((prev) => ({ ...prev, [activeTab]: nextMessages }));
    setIsRefining(true);

    try {
      const response = await axios.post("/api/ai/refine-content", {
        currentContent: generated,
        userMessage: userText,
        history: nextMessages,
        topic: formData.topic,
        platform: formData.platform,
        niche: formData.niche,
        targetField: activeTab,
      });

      const refined = {
        ...response.data?.content,
        hashtags: normalizeHashtags(response.data?.content?.hashtags),
      };

      setGenerated(refined);
      setChatMessagesByTab((prev) => ({
        ...prev,
        [activeTab]: [
          ...nextMessages,
          {
            role: "assistant",
            text:
              response.data?.assistantMessage ||
              `Done. I updated the ${activeTabLabel.toLowerCase()} as requested.`,
          },
        ],
      }));
      toast.success("Content updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Refinement failed");
      setChatMessagesByTab((prev) => ({
        ...prev,
        [activeTab]: [
          ...nextMessages,
          {
            role: "assistant",
            text: `I couldn't update the ${activeTabLabel.toLowerCase()}. Please try a clearer instruction.`,
          },
        ],
      }));
    } finally {
      setIsRefining(false);
    }
  };

  const handleSaveToProject = async () => {
    if (!generated) {
      toast.error("Generate content first.");
      return;
    }

    if ((isLinkedMode || saveMode === "existing") && !(selectedProjectId || linkedProjectId)) {
      toast.error("Please select a project.");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        content: generated,
        topic: formData.topic,
        platform: formData.platform,
        niche: formData.niche,
        createNew: !isLinkedMode && saveMode === "new",
      };

      if (isLinkedMode || saveMode === "existing") {
        payload.projectId = selectedProjectId || linkedProjectId;
      }

      const response = await axios.post("/api/ai/save-content", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const savedProject = response.data;

      if (!isLinkedMode && saveMode === "new") {
        setSaveMode("existing");
        setSelectedProjectId(savedProject?._id || "");
      }

      toast.success("Final content saved to project");

      try {
        await fetchProjects();
      } catch {
        toast.error("Saved, but project list could not refresh.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const getTabContent = () => {
    if (!generated) return "Fill the form and generate content first.";

    if (activeTab === "hashtags") {
      return generated.hashtags?.length ? generated.hashtags.join(" ") : "No hashtags";
    }

    return generated[activeTab] || "No content";
  };

  return (
    <div style={{ fontFamily: font, animation: "fadeIn 0.3s ease" }}>
      <div className={styles.generatorGrid}>
        <div className={`${styles.leftPanel} ${styles.mainContainer}`}>
          <h3 style={{ color: C.textPrimary, fontSize: 16, marginBottom: 12 }}>
            Generate AI Content
          </h3>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ color: C.textSecondary, fontSize: 12 }}>Topic *</label>
              <input
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                required
                placeholder="e.g. AI replacing entry-level jobs"
                style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
              />
            </div>

            <div>
              <label style={{ color: C.textSecondary, fontSize: 12 }}>Platform *</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange}
                style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
              >
                <option value="youtube">YouTube</option>
                <option value="youtube_music">YouTube Music</option>
                <option value="reddit">Reddit</option>
                <option value="x">X (Twitter)</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>

            <div>
              <label style={{ color: C.textSecondary, fontSize: 12 }}>Niche *</label>
              <input
                name="niche"
                value={formData.niche}
                onChange={handleInputChange}
                required
                placeholder="e.g. Technology"
                style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
              />
            </div>

            <div>
              <label style={{ color: C.textSecondary, fontSize: 12 }}>Prompt Type *</label>
              <select
                name="promptType"
                value={formData.promptType}
                onChange={handleInputChange}
                style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
              >
                {promptTypes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {!isLinkedMode && (
              <div>
                <label style={{ color: C.textSecondary, fontSize: 12 }}>Save To *</label>
                <select
                  value={saveMode}
                  onChange={(e) => {
                    setSaveMode(e.target.value);
                    if (e.target.value === "new") setSelectedProjectId("");
                  }}
                  style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
                >
                  <option value="new">Create a new project</option>
                  <option value="existing">Add to an existing project</option>
                </select>
              </div>
            )}

            {isLinkedMode && (
              <div style={{ color: C.accent, fontSize: 12, border: `1px solid ${C.borderAccent}`, background: C.accentDim, borderRadius: 8, padding: "10px 12px" }}>
                Final content will be saved to your active project.
              </div>
            )}

            {!isLinkedMode && saveMode === "existing" && (
              <div>
                <label style={{ color: C.textSecondary, fontSize: 12 }}>Select Project *</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={projectsLoading || projects.length === 0}
                  style={{ width: "100%", marginTop: 6, background: C.bgSidebar, border: `1px solid ${C.border}`, color: C.textPrimary, borderRadius: 8, padding: "10px 12px" }}
                >
                  <option value="">
                    {projectsLoading ? "Loading projects..." : projects.length === 0 ? "No projects found" : "Choose a project"}
                  </option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.title?.trim()
                        ? project.title
                        : `Untitled (${new Date(project.createdAt).toLocaleDateString()})`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isGenerating}
              style={{ marginTop: 4, background: C.accent, color: C.textDark, border: "none", borderRadius: 8, padding: "10px 12px", fontWeight: 700, cursor: "pointer", opacity: isGenerating ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
              {isGenerating ? "Generating..." : "Generate Draft"}
            </button>

            <button
              type="button"
              onClick={handleSaveToProject}
              disabled={isSaving || !generated || ((isLinkedMode || saveMode === "existing") && !(selectedProjectId || linkedProjectId))}
              style={{ background: generated ? "transparent" : C.bgSidebar, color: generated ? C.accent : C.textMuted, border: `1px solid ${generated ? C.borderAccent : C.border}`, borderRadius: 8, padding: "10px 12px", fontWeight: 700, cursor: generated ? "pointer" : "not-allowed", opacity: isSaving ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {isSaving ? "Saving..." : "Save Final To Project"}
            </button>
          </form>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.outputHeader}>
            <div className={styles.outputTitle}>{displayTitle}</div>
            <div className={styles.tabs}>
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ""}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.chatArea}>
            <div className={styles.generatedBox}>{getTabContent()}</div>

            <div className={styles.chatMessages}>
              {activeChatMessages.map((m, idx) => (
                <div
                  key={`${m.role}-${idx}`}
                  className={`${styles.chatBubble} ${m.role === "user" ? styles.userBubble : styles.aiBubble}`}
                >
                  {m.text}
                </div>
              ))}
              {isRefining && (
                <div className={`${styles.chatBubble} ${styles.aiBubble}`}>
                  <Loader2 className="animate-spin" size={14} /> Updating draft...
                </div>
              )}
            </div>
          </div>

          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <input
                value={activeChatInput}
                onChange={(e) =>
                  setChatInputByTab((prev) => ({
                    ...prev,
                    [activeTab]: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRefine();
                  }
                }}
                placeholder={`Tell AI how to refine ${activeTabLabel.toLowerCase()}...`}
                className={styles.textInput}
                disabled={!generated || isRefining}
              />
              <button
                type="button"
                onClick={handleRefine}
                className={styles.sendBtn}
                disabled={!generated || !activeChatInput.trim() || isRefining}
              >
                {isRefining ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />} Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;
