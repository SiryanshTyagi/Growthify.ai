import "dotenv/config";
import mongoose from "mongoose";
import dns from "node:dns";
import app from "./src/app.js";
import { MONGO_URI } from "./config.js";

const PORT = process.env.PORT || 5000;
dns.setServers(["8.8.8.8", "1.1.1.1"]);

mongoose
  .connect(MONGO_URI || process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Startup error:", error);
    process.exit(1);
  });



