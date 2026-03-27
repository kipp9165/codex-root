"use strict";

const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL] ?? LOG_LEVELS.info;

function timestamp() {
  return new Date().toISOString();
}

function log(level, ...args) {
  if (LOG_LEVELS[level] >= CURRENT_LEVEL) {
    console[level === "debug" || level === "info" ? "log" : level](
      `[${timestamp()}] [${level.toUpperCase()}]`,
      ...args
    );
  }
}

const logger = {
  debug: (...args) => log("debug", ...args),
  info:  (...args) => log("info",  ...args),
  warn:  (...args) => log("warn",  ...args),
  error: (...args) => log("error", ...args),
};

module.exports = logger;
