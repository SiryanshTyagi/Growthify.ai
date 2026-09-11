import axios from "axios";
import { X_BEARER_TOKEN } from "../../config.js";

async function fetchTrendingHashtagsIndia() {
  if (!X_BEARER_TOKEN) {
    console.warn("X_BEARER_TOKEN is missing. Skipping X hashtag fetch.");
    return [];
  }

  try {
    const response = await axios.get(
      "https://api.twitter.com/2/tweets/search/recent",
      {
        headers: {
          Authorization: `Bearer ${X_BEARER_TOKEN}`
        },
        params: {
          query: "(india OR #india) -is:retweet",
          max_results: 50,
          "tweet.fields": "entities"
        }
      }
    );

    const tweets = response.data.data || [];
    
    const hashtagCount = {};

    tweets.forEach(tweet => {
      if (tweet.entities?.hashtags) {
        tweet.entities.hashtags.forEach(tag => {
          const text = tag.tag.toLowerCase();
          hashtagCount[text] = (hashtagCount[text] || 0) + 1;
        });
      }
    });

    const sorted = Object.entries(hashtagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({
        hashtag: `#${tag}`,
        count
      }));

    return sorted;

  } catch (error) {
    if (error.response?.status === 401) {
      console.warn("X API token is unauthorized. Skipping X hashtag fetch.");
      return [];
    }

    console.warn("X fetch warning:", error.response?.data || error.message);
    return [];
  }
}

export { fetchTrendingHashtagsIndia };
