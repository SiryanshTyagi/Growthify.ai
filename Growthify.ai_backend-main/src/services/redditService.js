import axios from "axios";
import { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USER_AGENT } from "../../config.js";


async function getAccessToken() {
    const response = await axios.post(
        "https://www.reddit.com/api/v1/access_token",
        "grant_type=client_credentials",
        {
            auth: {
                username: REDDIT_CLIENT_ID,
                password: REDDIT_CLIENT_SECRET
            },
            headers: {
                "User-Agent": REDDIT_USER_AGENT,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    return response.data.access_token;
}

async function fetchTrendingRedditPosts() {
    const token = await getAccessToken();

    const response = await axios.get(
        "https://oauth.reddit.com/r/all/hot",
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "User-Agent": REDDIT_USER_AGENT
            },
            params: {
                limit: 50
            }
        }
    );

    return response.data.data.children.map(post => post.data);
}


export { fetchTrendingRedditPosts };