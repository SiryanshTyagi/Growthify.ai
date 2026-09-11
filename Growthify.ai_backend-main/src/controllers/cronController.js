// ─── IMPORTS (ES Modules Format) ───
import { fetchTrendingVideos, fetchTrendingMusic } from "../services/youtubeService.js";
import { fetchTrendingRedditPosts } from "../services/redditService.js";
import { fetchTrendingHashtagsIndia } from "../services/xService.js";

import TrendingX from "../models/TrendingX.js";
import TrendingVideo from "../models/TrendingVideo.js";
import TrendingMusic from "../models/TrendingMusic.js";
import TrendingReddit from "../models/TrendingReddit.js";

const bulkUpsertByKey = async (Model, docs, key) => {
  if (!docs.length) return;

  const timestamp = new Date();

  await Model.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { [key]: doc[key] },
        update: { $set: { ...doc, timestamp } },
        upsert: true,
      },
    })),
    { ordered: false },
  );
};

/* ------------------- YOUTUBE TRENDING VIDEOS ------------------- */
async function collectTrendingVideos() {
  try {
    console.log("Fetching trending videos...");
    const videos = await fetchTrendingVideos();
    const docs = videos.map(video => ({
      videoId: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      publishedAt: new Date(video.snippet.publishedAt),
      categoryId: video.snippet.categoryId,
      views: Number(video.statistics?.viewCount || 0),
      likes: Number(video.statistics?.likeCount || 0),
      comments: Number(video.statistics?.commentCount || 0)
    }));

    if (docs.length) {
      await bulkUpsertByKey(TrendingVideo, docs, "videoId");
      console.log("Videos saved at:", new Date());
    }
  } catch (error) {
    console.warn("Video collection warning:", error.message);
  }
}

/* ------------------- YOUTUBE TRENDING MUSIC ------------------- */
async function collectTrendingMusic() {
  try {
    console.log("Fetching trending music...");
    const musicVideos = await fetchTrendingMusic();
    const docs = musicVideos.map(video => ({
      videoId: video.id,
      title: video.snippet.title,
      views: Number(video.statistics?.viewCount || 0),
      likes: Number(video.statistics?.likeCount || 0),
      comments: Number(video.statistics?.commentCount || 0)
    }));

    if (docs.length) {
      await bulkUpsertByKey(TrendingMusic, docs, "videoId");
      console.log("Music saved at:", new Date());
    }
  } catch (error) {
    console.warn("Music collection warning:", error.message);
  }
}

/* ------------------- REDDIT TRENDING ------------------- */
async function collectTrendingReddit() {
  try {
    console.log("Fetching Reddit hot posts...");
    const posts = await fetchTrendingRedditPosts();
    const docs = posts.map(post => ({
      postId: post.id,
      title: post.title,
      subreddit: post.subreddit,
      score: post.score,
      numComments: post.num_comments,
      url: post.url
    }));

    if (docs.length) {
      await bulkUpsertByKey(TrendingReddit, docs, "postId");
      console.log("Reddit data saved at:", new Date());
    }
  } catch (error) {
    console.warn("Reddit collection warning:", error.message);
  }
}

/* ------------------- X (TWITTER) TRENDING ------------------- */
async function collectTrendingX() {
  try {
    console.log("Fetching X trending hashtags...");
    const hashtags = await fetchTrendingHashtagsIndia();

    if (hashtags.length) {
      await Promise.all(
        hashtags.map(tag =>
          TrendingX.updateOne(
            { hashtag: tag.hashtag },
            { $set: tag },
            { upsert: true }
          )
        )
      );
    }
    console.log("X hashtags saved at:", new Date());
  } catch (error) {
    console.warn("X collection warning:", error.message);
  }
}

/* ------------------- MASTER CRON FUNCTION ─── */
// Using ES Module export
export const runAllCronJobs = async () => {
  console.log("⏳ Starting all background data collection jobs...");
  await Promise.all([
    collectTrendingVideos(),
    collectTrendingMusic(),
    collectTrendingReddit(),
    collectTrendingX()
  ]);
  console.log("✅ All background jobs completed.");
};



