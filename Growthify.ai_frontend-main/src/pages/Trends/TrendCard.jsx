import React from "react";
import { Heart, MessageSquare, Bookmark, Eye, Trash2 } from "lucide-react";
import { C } from "../../theme/theme.js";
import styles from "../../pages/Trends/Trends.module.css";

const TrendCard = ({ trend, icon, platform, isSaved, onSave, onRemove }) => {
  const handleButtonClick = async () => {
    if (isSaved) {
      onRemove && await onRemove(trend);
    } else {
      onSave && await onSave(trend, platform);
    }
  };

  // For X platform, display hashtag with # prefix
  const displayTitle = platform === "x" || platform === "X" ? 
    (trend.title?.startsWith("#") ? trend.title : `#${trend.title}`) : 
    trend.title;

  return (
    <div className={styles.trendCard}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
        {icon}
        <h3 style={{ color: C.textPrimary, fontSize: 16.5, fontWeight: 700, margin: 0, flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {displayTitle}
        </h3>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "14px 0", color: C.textSecondary, fontSize: 12.5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Eye size={14} /> {trend.views || 0}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Heart size={14} /> {trend.likes || 0}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageSquare size={14} /> {trend.comments || 0}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Bookmark size={14} /> {trend.saves || 0}</div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
        <button className={isSaved ? styles.deleteBtn : styles.saveBtn} onClick={handleButtonClick}>
          {isSaved ? <><Trash2 size={15} /> Delete</> : <><Bookmark size={15} /> Save</>}
        </button>
      </div>
    </div>
  );
};

export default TrendCard;