import React from "react";
import { Youtube, MessageCircle, Music, Twitter } from "lucide-react";
import TrendCard from "./TrendCard.jsx";
import { C } from "../../theme/theme.js";

const Grid = ({ children }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
    {children}
  </div>
);

export const YoutubeTrends = ({ data, savedTrendIds, onSave, onRemove }) => (
  <Grid>
    {data?.length > 0 ? data.map((t, i) => (
      <TrendCard 
        key={i} 
        trend={t} 
        platform="youtube"
        icon={<Youtube size={16} color="#ff0000" />}
        isSaved={savedTrendIds?.includes(t.videoId || t._id)}
        onSave={onSave}
        onRemove={onRemove}
      />
    )) 
    : <p style={{ color: C.textSecondary }}>No YouTube trends.</p>}
  </Grid>
);

export const RedditTrends = ({ data, savedTrendIds, onSave, onRemove }) => (
  <Grid>
    {data?.length > 0 ? data.map((t, i) => (
      <TrendCard 
        key={i} 
        trend={t} 
        platform="reddit"
        icon={<MessageCircle size={16} color="#FF4500" />}
        isSaved={savedTrendIds?.includes(t.postId || t._id)}
        onSave={onSave}
        onRemove={onRemove}
      />
    )) 
    : <p style={{ color: C.textSecondary }}>No Reddit trends.</p>}
  </Grid>
);

export const XTrends = ({ data, savedTrendIds, onSave, onRemove }) => (
  <Grid>
    {data?.length > 0 ? data.map((t, i) => (
      <TrendCard 
        key={i} 
        trend={t} 
        platform="X"
        icon={<Twitter size={16} color="#1DA1F2" />}
        isSaved={savedTrendIds?.includes(t.tweetId || t._id)}
        onSave={onSave}
        onRemove={onRemove}
      />
    )) 
    : <p style={{ color: C.textSecondary }}>No X trends.</p>}
  </Grid>
);

export const MusicTrends = ({ data, savedTrendIds, onSave, onRemove }) => (
  <Grid>
    {data?.length > 0 ? data.map((t, i) => (
      <TrendCard 
        key={i} 
        trend={t} 
        platform="youtube_music"
        icon={<Music size={16} color="#ff0000" />}
        isSaved={savedTrendIds?.includes(t.videoId || t._id)}
        onSave={onSave}
        onRemove={onRemove}
      />
    )) 
    : <p style={{ color: C.textSecondary }}>No Music trends.</p>}
  </Grid>
);
