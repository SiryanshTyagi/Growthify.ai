// import 'dotenv/config';

// module.exports = {
//   YT_API_KEY: process.env.YT_API_KEY,
//   REGION: process.env.REGION,
//   MONGO_URI: process.env.MONGO_URI,
//   REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
//   REDDIT_CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
//   REDDIT_USER_AGENT: process.env.REDDIT_USER_AGENT,
//   X_BEARER_TOKEN: process.env.X_BEARER_TOKEN
// };


import dotenv from "dotenv";

dotenv.config();

// Ab sab kuch ES Modules ke tareeqe se export ho raha hai
export const YT_API_KEY = process.env.YT_API_KEY;
export const REGION = process.env.REGION;
export const MONGO_URI = process.env.MONGO_URI;
export const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
export const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
export const REDDIT_USER_AGENT = process.env.REDDIT_USER_AGENT;
export const X_BEARER_TOKEN = process.env.X_BEARER_TOKEN;