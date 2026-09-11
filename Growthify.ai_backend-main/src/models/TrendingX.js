import mongoose from "mongoose";

const trendingXSchema = new mongoose.Schema(
  {
    hashtag: {
      type: String,
      unique: true
    },
    count: Number
  },
  { timestamps: true }
);


export default mongoose.model("TrendingX", trendingXSchema);