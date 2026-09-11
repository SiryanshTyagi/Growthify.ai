import axios from "axios";
import { YT_API_KEY, REGION  } from "../../config.js";


async function fetchTrendingVideos() {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: { part: "snippet,statistics", chart: "mostPopular", regionCode: REGION, maxResults: 50, key: YT_API_KEY }
    });
    return response.data.items;
}

async function fetchTrendingMusic() {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/videos", {
        params: { part: "snippet,statistics", chart: "mostPopular", regionCode: REGION, videoCategoryId: 10, maxResults: 25, key: YT_API_KEY }
    });
    return response.data.items;
}


export { fetchTrendingVideos, fetchTrendingMusic };