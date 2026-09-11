import React from "react";
import { C } from "../../theme/theme.js";
import styles from "../../pages/Projects/Projects.module.css"; 
import { getStatusStyle, getPlatformIcon, getPlatformId } from "../../constants/projectConstants.jsx";

const ProjectCard = ({ project, onClick }) => {
  const statusInfo = getStatusStyle(project.status);
  const platformId = getPlatformId(project.platform);
  
  // Format Date (e.g., Feb 12, 2026)
  const formattedDate = new Date(project.createdAt).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });

  const hasThumbnail = Boolean(project.thumbnailUrl);

  return (
    <div className={styles.card} onClick={() => onClick(project)}>
      <div className={styles.cardImageWrapper}>
        {hasThumbnail ? (
          <img src={project.thumbnailUrl} alt={project.title || "Project thumbnail"} className={styles.cardImage} />
        ) : (
          <div
            className={styles.cardImage}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: C.bgSidebar,
              color: C.textSecondary,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            No thumbnail
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h3 style={{ color: C.textPrimary, fontSize: 16, fontWeight: 700, margin: 0, flex: 1, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {project.title || project.topic || "Untitled Project"}
        </h3>
        <span style={{ background: statusInfo.bg, color: statusInfo.color, padding: "4px 10px", borderRadius: "50px", fontSize: 11, fontWeight: 600 }}>
          {statusInfo.label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.textSecondary, fontSize: 13, marginBottom: 12, textTransform: "capitalize" }}>
        {getPlatformIcon(platformId)} {project.platform || "Web"}
      </div>
      <div style={{ color: C.textMuted, fontSize: 12, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
        Created: {formattedDate}
      </div>
    </div>
  );
};

export default ProjectCard;
