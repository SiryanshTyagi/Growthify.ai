import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { C, font } from "../theme/theme.js";

const cardStyle = {
  background: C.bgCard,
  border: `1px solid ${C.border}`,
  borderRadius: 14,
  padding: 16,
};

const ProjectWorkspace = ({ projectId, onGoToContent, onGoToThumbnail }) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const response = await axios.get(`/api/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error("Failed to load project workspace:", error);
      setProject(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const hashtagText = useMemo(() => {
    if (!project?.hashtags || project.hashtags.length === 0) return "No hashtags yet";
    return project.hashtags.join(" ");
  }, [project]);

  if (!projectId) {
    return (
      <div style={{ color: C.textSecondary, fontFamily: font }}>
        Create a new project to open the project workspace.
      </div>
    );
  }

  return (
    <div style={{ fontFamily: font, animation: "fadeIn 0.25s ease" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: C.textPrimary, fontSize: 30, fontWeight: 800, margin: 0 }}>Project Workspace</h1>
        <p style={{ color: C.textSecondary, fontSize: 14, marginTop: 8 }}>
          Build your project assets from here. Generated content and thumbnails will be added to this project.
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
          <Loader2 className="animate-spin" size={36} style={{ color: C.accent }} />
        </div>
      ) : (
        <>
          <div style={{ ...cardStyle, marginBottom: 18 }}>
            <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 10 }}>Thumbnail</div>
            <div style={{ background: C.bgSidebar, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {project?.thumbnailUrl ? (
                <img src={project.thumbnailUrl} alt="Project thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: C.textMuted }}>
                  <ImageIcon size={28} />
                  <span style={{ fontSize: 12 }}>No thumbnail generated yet</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={cardStyle}>
              <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 8 }}>Title</div>
              <div style={{ color: C.textPrimary, fontSize: 16, fontWeight: 700 }}>
                {project?.title || "No title yet"}
              </div>
            </div>

            <div style={cardStyle}>
              <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 8 }}>Hook</div>
              <div style={{ color: C.textPrimary, fontSize: 14, lineHeight: 1.5 }}>
                {project?.hook || "No hook yet"}
              </div>
            </div>

            <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
              <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 8 }}>Script</div>
              <div style={{ color: C.textPrimary, fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap", maxHeight: 160, overflowY: "auto" }}>
                {project?.script || "No script yet"}
              </div>
            </div>

            <div style={{ ...cardStyle, gridColumn: "1 / -1" }}>
              <div style={{ color: C.textSecondary, fontSize: 12, marginBottom: 8 }}>Hashtags</div>
              <div style={{ color: C.textPrimary, fontSize: 14, lineHeight: 1.5 }}>
                {hashtagText}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 22, ...cardStyle, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => onGoToContent(projectId)}
              style={{ background: C.accent, color: C.textDark, border: "none", borderRadius: 999, fontWeight: 700, fontSize: 13, padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            >
              <Sparkles size={14} /> Generate Content
            </button>
            <button
              onClick={() => onGoToThumbnail(projectId)}
              style={{ background: "transparent", color: C.accent, border: `1px solid ${C.borderAccent}`, borderRadius: 999, fontWeight: 700, fontSize: 13, padding: "10px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
            >
              <ImageIcon size={14} /> Generate Thumbnail
            </button>
            <button
              onClick={fetchProject}
              style={{ background: C.bgSidebar, color: C.textSecondary, border: `1px solid ${C.border}`, borderRadius: 999, fontWeight: 600, fontSize: 13, padding: "10px 16px", cursor: "pointer" }}
            >
              Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectWorkspace;
