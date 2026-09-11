import React from "react";
import { Youtube, Twitter, MessageCircle } from "lucide-react";

const PlatformCards = () => {
  const platforms = [
    {
      name: "YouTube",
      followers: "128.4K",
      metricLabel: "Current subscribers",
      growth: "+6.8%",
      icon: Youtube,
    },
    {
      name: "X",
      followers: "42.1K",
      metricLabel: "Current followers",
      growth: "+3.2%",
      icon: Twitter,
    },
    {
      name: "Reddit",
      followers: "19.7K",
      metricLabel: "Current members",
      growth: "+4.9%",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {platforms.map((platform) => (
        <div
          key={platform.name}
          className="bg-brand-card border border-brand-border rounded-xl p-4 hover:bg-brand-cardHover transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-brand-textPrimary font-semibold text-sm">
              {platform.name}
            </p>
            <platform.icon size={18} className="text-brand-accent" />
          </div>
          <p className="text-brand-textSecondary text-xs mb-1">
            {platform.metricLabel}
          </p>
          <p className="text-brand-textPrimary text-xl font-bold leading-none">
            {platform.followers}
          </p>
          <p className="text-brand-accent text-xs font-semibold mt-2">
            Growth: {platform.growth}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PlatformCards;
