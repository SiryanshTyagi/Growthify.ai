import express from "express";
import { getAllTrends, refreshTrends, saveTrend, getSavedTrends, deleteSavedTrend } from "../controllers/trendingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Jab frontend GET /api/v1/trending call karega, tab ye chalega
router.get("/", getAllTrends);

// Refresh trend data on demand
router.post("/refresh", authMiddleware, refreshTrends);

// Save a trend
router.post("/save", authMiddleware, saveTrend);

// Get saved trends for logged-in user
router.get("/saved", authMiddleware, getSavedTrends);

// Delete a saved trend
router.post("/delete-save", authMiddleware, deleteSavedTrend);

export default router;
