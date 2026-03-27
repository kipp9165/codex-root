import { NODE_ENV } from "../config/env.js";

const levels = { error: 0, warn: 1, info: 2, debug: 3 };
const currentLevel = NODE_ENV === "production" ? levels.info : levels.debug;

function log(level, message, meta = {}) {
  if (levels[level] > currentLevel) return;
  const entry = {
    ts: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  const output = JSON.stringify(entry);
  if (level === "error" || level === "warn") {
    console.error(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  error: (message, meta) => log("error", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  info: (message, meta) => log("info", message, meta),
  debug: (message, meta) => log("debug", message, meta),
};
