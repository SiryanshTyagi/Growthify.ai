import express from "express";
import cors from "cors";

// ─── IMPORTING ROUTES (ES Module format) ───
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

// Converted from require to import (added .js extension for ES modules)
import trendingRoutes from "./routes/trendingRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// ─── MIDDLEWARES ───
app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
  })
);
app.use(express.json());

// ─── ROUTES ───
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/schedule", scheduleRoutes);


// New route for trending data  
app.use("/api/v1/trending", trendingRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("GrowthSync API Running 🚀");
});

// ─── GLOBAL ERROR HANDLER ───
// Isko hamesha saare routes ke neeche rakhna zaroori hai
app.use(errorHandler);

export default app;
