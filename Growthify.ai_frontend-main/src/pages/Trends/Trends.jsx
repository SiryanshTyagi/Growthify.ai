import React, { useState, useEffect } from "react";
import axios from "axios"; // API calls ke liye
import { Loader2 } from "lucide-react";
import { C, font } from "../../theme/theme.js";
import { YoutubeTrends, RedditTrends, XTrends, MusicTrends } from "./PlatformViews";
import toast from "react-hot-toast";


const platformTabs = [
  { id: 'yt', label: 'YouTube' },
  { id: 'yt_Music', label: 'YouTube Music' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'X', label: 'X (Twitter)' },
];

const Trends = () => {
  const [activePlatform, setActivePlatform] = useState('yt');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiTrends, setApiTrends] = useState({ youtube: [], reddit: [], X: [], youtube_music: [] });
  const [savedTrends, setSavedTrends] = useState([]);
  const [savedTrendIds, setSavedTrendIds] = useState([]);

  const applyTrendData = (data) => {
    setApiTrends({
      youtube: (data.youtube || []).map(i => ({ ...i, score: 95, likes: "Trending", tags: ["#yt"] })),
      reddit: (data.reddit || []).map(i => ({ ...i, score: i.score > 100 ? 99 : i.score, likes: i.score, tags: [`#${i.subreddit}`] })),
      X: (data.x || []).map(i => ({ ...i, title: i.hashtag, score: 90, likes: "High", tags: ["#X"] })),
      youtube_music: (data.youtube_music || []).map(i => ({ ...i, score: 88, likes: "Viral", tags: ["#Music"] }))
    });
  };

  // Fetch all trends
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/v1/trending");
        if (res.data?.success) {
          applyTrendData(res.data.data || {});
        }
      } catch (err) { 
        console.error(err); 
      } 
      finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  // Fetch saved trends
  useEffect(() => {
    const fetchSavedTrends = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/trending/saved", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data?.success) {
          setSavedTrends(res.data.data || []);
          setSavedTrendIds(res.data.data?.map(t => t.trendId) || []);
        }
      } catch (err) {
        console.error("Error fetching saved trends:", err);
      }
    };
    fetchSavedTrends();
  }, []);

  const handleRefreshTrends = async () => {
    try {
      setRefreshing(true);
      const token = localStorage.getItem("token");
      const res = await axios.post("/api/v1/trending/refresh", {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data?.success) {
        applyTrendData(res.data.data || {});
        toast.success("Trends refreshed");
      }
    } catch (error) {
      console.error("Error refreshing trends:", error);
      toast.error(error.response?.data?.message || "Failed to refresh trends");
    } finally {
      setRefreshing(false);
    }
  };

  // Save trend
  const handleSaveTrend = async (trend, platform) => {
    try {
      const token = localStorage.getItem("token");
      const normalizedPlatform =
        platform === "X" ? "X" : String(platform || "").toLowerCase();

      // Convert likes to number, handling string values
      let likesValue = trend.likes;
      if (typeof likesValue === 'string') {
        likesValue = 0; // Default to 0 if it's a string
      } else {
        likesValue = Number(likesValue) || 0;
      }

      const payload = {
        platform: normalizedPlatform,
        trendId: trend.videoId || trend.postId || trend.tweetId || trend._id,
        title: trend.title,
        views: Number(trend.views) || 0,
        likes: likesValue,
        comments: Number(trend.comments) || 0,
        description: trend.description || ""
      };

      console.log("Sending payload:", payload);

      const res = await axios.post("/api/v1/trending/save", payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Response from server:", res.data);
      
      if (res.data?.success) {
        setSavedTrendIds([...savedTrendIds, payload.trendId]);
        setSavedTrends([...savedTrends, res.data.data]);
        toast.success("Trend saved successfully!");

      }
    } catch (error) {
      console.error("Error saving trend:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to save trend");
    }
  };

  // Remove saved trend
  const handleRemoveSavedTrend = async (trend) => {
    try {
      // Determine the trend ID from the trend object
      let trendId = trend.videoId || trend.postId || trend.tweetId || trend.trendId || trend._id;
      
      // Determine the platform from the trend object or from savedTrends
      let platform = trend.platform;
      if (!platform) {
        const savedTrend = savedTrends.find(t => t.trendId === trendId);
        platform = savedTrend?.platform;
      }

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
        setSavedTrendIds(savedTrendIds.filter(id => id !== trendId));
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h1 style={{ color: C.textPrimary, fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800 }}>Explore Trends</h1>
          <button
            type="button"
            onClick={handleRefreshTrends}
            disabled={refreshing}
            style={{
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: refreshing ? "not-allowed" : "pointer",
              opacity: refreshing ? 0.7 : 1
            }}
          >
            {refreshing ? "refreshing" : "refresh"}
          </button>
        </div>
        <p style={{ color: C.textSecondary, fontSize: 14.5 }}>Discover real-time topics across platforms.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 20, marginBottom: 20, borderBottom: `1px solid ${C.border}`, overflowX: "auto", paddingBottom: 2 }}>
        {platformTabs.map(tab => (
          <div key={tab.id} onClick={() => setActivePlatform(tab.id)}
            style={{ paddingBottom: 12, cursor: "pointer", borderBottom: activePlatform === tab.id ? `2px solid ${C.accent}` : "2px solid transparent", whiteSpace: "nowrap" }}>
            <span style={{ color: activePlatform === tab.id ? C.accent : C.textSecondary, fontSize: 14, fontWeight: activePlatform === tab.id ? 600 : 400 }}>
              {tab.label}
            </span>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px 0" }}>
          <Loader2 className="animate-spin" style={{ color: C.accent }} size={40} />
        </div>
      ) : (
        <div>
          {activePlatform === 'yt' && <YoutubeTrends data={apiTrends.youtube} savedTrendIds={savedTrendIds} onSave={handleSaveTrend} onRemove={handleRemoveSavedTrend} />}
          {activePlatform === 'yt_Music' && <MusicTrends data={apiTrends.youtube_music} savedTrendIds={savedTrendIds} onSave={handleSaveTrend} onRemove={handleRemoveSavedTrend} />}
          {activePlatform === 'reddit' && <RedditTrends data={apiTrends.reddit} savedTrendIds={savedTrendIds} onSave={handleSaveTrend} onRemove={handleRemoveSavedTrend} />}
          {activePlatform === 'X' && <XTrends data={apiTrends.X} savedTrendIds={savedTrendIds} onSave={handleSaveTrend} onRemove={handleRemoveSavedTrend} />}
        </div>
      )}
    </div>
  );
};

export default Trends;









