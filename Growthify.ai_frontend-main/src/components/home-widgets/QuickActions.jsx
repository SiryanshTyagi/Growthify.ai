import React from "react";
import { C, font } from "../../theme/theme.js";

const actions = [
  {
    label: "Explore Trends",
    nav: "Trends",
    icon: (
      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 0v10l4 2"/>
        <circle cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: "Generate Content",
    nav: "Content Generator",
    icon: (
      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
  },
  {
    label: "View Projects",
    nav: "Projects",
    icon: (
      <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
];

const QuickActions = ({ onNavigate }) => {
  return (
    <div style={{ marginBottom: 28, fontFamily: font }}>
      <h3 style={{
        color: C.textPrimary,
        fontSize: 15,
        fontWeight: 700,
        margin: "0 0 14px 0",
      }}>
        Quick Actions
      </h3>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onNavigate?.(action.nav)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 18px",
              background: "transparent",
              border: `1.5px solid ${C.accent}`,
              borderRadius: 50,
              color: C.accent,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: font,
              cursor: "pointer",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = C.accentDim;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
