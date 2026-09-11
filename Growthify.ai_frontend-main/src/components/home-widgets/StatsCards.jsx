import React from "react";
import { Users, Target, FileCheck } from "lucide-react";

const StatsCards = ({ stats, loading }) => {
  const cards = [
    {
      label: "Total Projects",
      value: stats?.totalProjects ?? 0,
      sub: "All Time",
      icon: Users,
    },
    {
      label: "Draft",
      value: stats?.draftCount ?? 0,
      sub: "In Progress",
      icon: Target,
    },
    {
      label: "Published",
      value: stats?.publishedCount ?? 0,
      sub: "Published This Week: " + (stats?.publishedThisWeek ?? 0),
      icon: FileCheck,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
      {cards.map((stat, i) => (
        <div
          key={i}
          className="bg-brand-card border border-brand-border p-4 rounded-xl hover:border-brand-accent/30 hover:bg-brand-cardHover transition-all group"
        >
          <div className="w-9 h-9 rounded-full bg-brand-accentDim border border-brand-accent/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <stat.icon size={18} className="text-brand-accent" />
          </div>
          <p className="text-brand-textSecondary text-xs mb-1">{stat.label}</p>
          <p className="text-xl font-bold text-brand-textPrimary">
            {loading ? "..." : stat.value}
          </p>
          <p className="text-brand-textSecondary/50 text-[11px] mt-1">
            {stat.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
