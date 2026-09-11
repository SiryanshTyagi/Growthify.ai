import React from "react";
import { ExternalLink } from "lucide-react";

const ProjectItem = ({ project, onClick }) => {
  // Helper for Badge Styling
  const getBadgeStyling = (dbStatus) => {
    switch (dbStatus) {
      case "published":
        return { badge: "Live", type: "teal" };
      default:
        return { badge: "Draft", type: "gray" };
    }
  };

  const style = getBadgeStyling(project.status);
  const updatedAtValue = project.updatedAt || project.createdAt;
  const formattedUpdatedAt = updatedAtValue
    ? new Date(updatedAtValue).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "Not available";

  //   totalProjects,
  //   draftCount,
  //   scheduledCount,
  //   publishedCount,
  //   publishedThisWeek,
  //   recentProjects,

  return (
    <div
      className="bg-brand-card border border-brand-border p-4 rounded-xl hover:bg-brand-cardHover transition-all group cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="pr-3">
          <span className="text-brand-textPrimary font-bold text-sm break-words">
            {project.title || project.topic || "Untitled Project"}
          </span>
        </div>
        <ExternalLink
          size={14}
          className="text-brand-textSecondary opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] text-brand-textSecondary leading-5">
            <span className="font-semibold">Last updated:</span>{" "}
            {formattedUpdatedAt}
          </div>
        </div>

        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${
            style.type === "teal"
              ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20"
              : "bg-white/5 text-brand-textSecondary border-white/10"
          }`}
        >
          {style.badge}
        </span>
      </div>
    </div>
  );
};

export default ProjectItem;
