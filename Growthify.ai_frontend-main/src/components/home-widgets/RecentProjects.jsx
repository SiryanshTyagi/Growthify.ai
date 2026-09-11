import React from "react";
import ProjectItem from "./ProjectItem";
import ProjectSkeleton from "./ProjectSkeleton";

const RecentProjects = ({ projects = [], loading = false, onProjectClick }) => {
  return (
    <section>
      <h3 className="text-brand-textPrimary text-sm font-bold mb-4">
        Your Projects
      </h3>

      {loading ? (
        <ProjectSkeleton />
      ) : projects.length === 0 ? (
        <div className="text-brand-textSecondary text-xs bg-brand-card p-4 rounded-lg border border-dashed border-brand-border">
          No projects found. Generate your first project to see it here!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <ProjectItem
              key={project._id || index}
              project={project}
              onClick={() => onProjectClick(project._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentProjects;
