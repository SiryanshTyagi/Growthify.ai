import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { C, font } from "../theme/theme.js";
import toast from "react-hot-toast";


const Saves = ({ onAddToProject = () => {} }) => {
  const [loading, setLoading] = useState(true);
  const [savedTrends, setSavedTrends] = useState([]);

  // Fetch saved trends
  useEffect(() => {
    const fetchSavedTrends = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/trending/saved", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data?.success) {
          setSavedTrends(res.data.data || []);
      

        }
      } catch (err) {
        console.error("Error fetching saved trends:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedTrends();
  }, []);

  // Remove saved trend
  const handleRemoveSavedTrend = async (trend) => {
    try {
      let trendId = trend.videoId || trend.postId || trend.tweetId || trend.trendId || trend._id;
      let platform = trend.platform;

      const token = localStorage.getItem("token");
      const res = await axios.post("/api/v1/trending/delete-save", {
        trendId,
        platform
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data?.success) {
        setSavedTrends(savedTrends.filter(t => t.trendId !== trendId));
        toast.success("Trend removed from saves!");
      }
    } catch (error) {
      console.error("Error removing saved trend:", error);
      toast.error("Failed to remove trend from saves");
    }
  };

  return (
    <div style={{ fontFamily: font }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ color: C.textPrimary, fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800 }}>Saved Trends</h1>
        <p style={{ color: C.textSecondary, fontSize: 14.5 }}>Your collection of saved trends from all platforms.</p>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px 0" }}>
          <Loader2 className="animate-spin" style={{ color: C.accent }} size={40} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
          {savedTrends?.length > 0 ? (
            savedTrends.map((t, i) => {
              let icon = null;
              if (t.platform === 'youtube') icon = <span style={{ color: '#ff0000' }}>▶</span>;
              else if (t.platform === 'youtube_music') icon = <span style={{ color: '#ff0000' }}>♪</span>;
              else if (t.platform === 'reddit') icon = <span style={{ color: '#FF4500' }}>◆</span>;
              else if (t.platform === 'X') icon = <span style={{ color: '#1DA1F2' }}>✕</span>;
              
              // For X platform, display hashtag with # prefix
              const displayTitle = t.platform === 'X' ? 
                (t.title?.startsWith("#") ? t.title : `#${t.title}`) : 
                t.title;
              
              return (
                <div key={i} style={{ 
                  background: C.bgCard,
                  border: `1px solid ${C.border}`,
                  borderRadius: "16px",
                  padding: "22px 20px",
                  cursor: "pointer",
                  transition: "transform 0.3s, box-shadow 0.3s"
                }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                    {icon}
                    <h3 style={{ color: C.textPrimary, fontSize: 16.5, fontWeight: 700, margin: 0 }}>
                      {displayTitle}
                    </h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "14px 0", color: C.textSecondary, fontSize: 12.5 }}>
                    <div>👁 {t.views || 0}</div>
                    <div>❤ {t.likes || 0}</div>
                    <div>💬 {t.comments || 0}</div>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <button style={{ 
                      flex: 1,
                      marginTop: 15,
                      padding: "8px",
                      background: "rgba(76, 175, 80, 0.1)",
                      color: "#4CAF50",
                      border: "1px solid rgba(76, 175, 80, 0.3)",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "12.5px",
                      fontWeight: 500
                    }} onClick={() => {
                      onAddToProject(t.title, t.platform);
                      toast.success("Trend added to project!"); // 🟢 Yahan Toast aayega
                    }}>
                      ➕ Add to Project
                    </button>
                    <button style={{ 
                      flex: 1,
                      marginTop: 15,
                      padding: "8px",
                      background: "#1a0f10",
                      color: "#ff6464",
                      border: "1px solid rgba(255, 100, 100, 0.3)",
                      borderRadius: "50px",
                      cursor: "pointer",
                      fontSize: "12.5px",
                      fontWeight: 500
                    }} onClick={() => handleRemoveSavedTrend(t)}>
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: C.textSecondary }}>No saved trends yet!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Saves;
