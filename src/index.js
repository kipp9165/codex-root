"use strict";

require("dotenv/config");
const logger = require("./utils/logger");
const listener = require("./listeners/tierActivationListener");

logger.info("Codex system starting...");

listener.start();

// Graceful shutdown
function shutdown(signal) {
  logger.info(`Received ${signal} — shutting down.`);
  listener.stop();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));
