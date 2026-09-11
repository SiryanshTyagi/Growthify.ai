import React from "react";

const ProjectSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-brand-card/50 border border-brand-border/50 p-4 rounded-xl h-24">
          <div className="flex justify-between mb-4">
            <div className="h-4 w-24 bg-brand-border rounded"></div>
            <div className="h-4 w-4 bg-brand-border rounded"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 w-16 bg-brand-border rounded"></div>
            <div className="h-4 w-12 bg-brand-border rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectSkeleton;