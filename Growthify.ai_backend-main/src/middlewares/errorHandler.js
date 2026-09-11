import { logError } from "../utils/logger.js";

// Basic error handling middleware
const errorHandler = (err, req, res, next) => {
  logError("Unhandled API error", err, {
    route: req?.originalUrl,
    method: req?.method,
  });
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

export default errorHandler;
