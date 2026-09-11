import mongoose from "mongoose";

const trendingRedditSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 3   // 3 days TTL
    },

    postId: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true
    },

    subreddit: {
        type: String,
        default: ""
    },

    score: {
        type: Number,
        default: 0
    },

    numComments: {
        type: Number,
        default: 0
    },

    url: {
        type: String,
        default: ""
    }

});


export default mongoose.model("TrendingReddit", trendingRedditSchema);