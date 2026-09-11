import mongoose from "mongoose";

const savedTrendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  platform: {
    type: String,
    enum: ["youtube", "youtube_music", "reddit", "X"],
    required: true
  },

  trendId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  views: {
    type: Number,
    default: 0
  },

  likes: {
    type: Number,
    default: 0
  },

  comments: {
    type: Number,
    default: 0
  },

  description: {
    type: String,
    default: ""
  },

  savedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one user can't save the same trend twice
savedTrendSchema.index({ userId: 1, trendId: 1, platform: 1 }, { unique: true });

export default mongoose.model("SavedTrend", savedTrendSchema);
