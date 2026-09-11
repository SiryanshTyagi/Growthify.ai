import fs from "fs";
import path from "path";

const logsDir = path.resolve(process.cwd(), "logs");
const appLogPath = path.join(logsDir, "app.log");
const errorLogPath = path.join(logsDir, "error.log");

const ensureLogsDir = () => {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
};

const toLine = (level, message, meta = {}) =>
  JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    meta,
  });

const writeLine = (targetFile, line) => {
  ensureLogsDir();
  fs.appendFileSync(targetFile, `${line}\n`, "utf8");
};

export const logInfo = (message, meta = {}) => {
  const line = toLine("info", message, meta);
  console.log(`[INFO] ${message}`, meta);
  writeLine(appLogPath, line);
};

export const logWarn = (message, meta = {}) => {
  const line = toLine("warn", message, meta);
  console.warn(`[WARN] ${message}`, meta);
  writeLine(appLogPath, line);
};

export const logError = (message, error, meta = {}) => {
  const errorMeta = {
    ...meta,
    error: {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      statusCode: error?.statusCode || error?.$metadata?.httpStatusCode,
      requestId: error?.$metadata?.requestId,
      details: error?.details,
    },
  };

  const line = toLine("error", message, errorMeta);
  console.error(`[ERROR] ${message}`, errorMeta);
  writeLine(errorLogPath, line);
  writeLine(appLogPath, line);
};
