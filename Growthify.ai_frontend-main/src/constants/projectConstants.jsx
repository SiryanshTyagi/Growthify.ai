import React from "react";
import {
  Youtube,
  Instagram,
  Twitter,
  MessageCircle,
  Globe,
} from "lucide-react";

export const dummyProjects = [
  {
    id: 1,
    title: "AI vs Jobs: The Reality",
    status: "Draft",
    platform: "YouTube",
    platformId: "yt",
    date: "Feb 12, 2026",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=500&auto=format&fit=crop",
    views: "N/A",
    niche: "Technology",
  },
  {
    id: 2,
    title: "React 19 Server Components",
    status: "Draft",
    platform: "Instagram",
    platformId: "insta",
    date: "Feb 11, 2026",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500&auto=format&fit=crop",
    views: "N/A",
    niche: "Web Dev",
  },
  {
    id: 3,
    title: "My Workflow Secrets",
    status: "Published",
    platform: "Threads (X)",
    platformId: "x",
    date: "Feb 09, 2026",
    image:
      "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=500&auto=format&fit=crop",
    views: "14.2K",
    niche: "Productivity",
  },
  {
    id: 4,
    title: "Midjourney v6 Prompts",
    status: "Draft",
    platform: "Reddit",
    platformId: "reddit",
    date: "Feb 08, 2026",
    image:
      "https://images.unsplash.com/photo-1684369175836-9a291f42d207?q=80&w=500&auto=format&fit=crop",
    views: "N/A",
    niche: "AI Art",
  },
];

// Helper: Backend ke platform string ko icon id me convert karne ke liye
export const getPlatformId = (platformString) => {
  if (!platformString) return "web";
  const str = platformString.toLowerCase();
  if (str.includes("youtube") || str === "yt") return "yt";
  if (str.includes("insta")) return "insta";
  if (str.includes("twitter") || str === "x") return "x";
  if (str.includes("reddit")) return "reddit";
  return "web";
};

// Helper: UI Colors based on Database Status
export const getStatusStyle = (status) => {
  const s = (status || "draft").toLowerCase();
  if (s === "draft")
    return { bg: "rgba(240, 165, 0, 0.15)", color: "#f0a500", label: "Draft" };
  return {
    bg: "rgba(0, 230, 195, 0.15)",
    color: "#00E6C3",
    label: "Published",
  };
};

// Helper: Render Icon
export const getPlatformIcon = (id, size = 16) => {
  if (id === "yt") return <Youtube size={size} color="#ff0000" />;
  if (id === "insta") return <Instagram size={size} color="#E1306C" />;
  if (id === "x") return <Twitter size={size} color="#1DA1F2" />;
  if (id === "reddit") return <MessageCircle size={size} color="#FF4500" />;
  return <Globe size={size} color="#8FB7B5" />; // Fallback icon
};
