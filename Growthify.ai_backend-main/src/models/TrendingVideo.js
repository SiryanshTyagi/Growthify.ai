import mongoose from "mongoose";

const trendingVideoSchema = new mongoose.Schema({
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 3   // 3 days TTL
    },

    videoId: {
        type: String,
        required: true,
        unique: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ""
    },

    publishedAt: {
        type: Date,
        required: true
    },

    categoryId: {
        type: String,
        default: ""
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
    }

});


export default mongoose.model("TrendingVideo", trendingVideoSchema);