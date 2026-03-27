import { logger } from "../utils/logger.js";

/**
 * Global error handler middleware.
 * Must be registered last in Express app.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";
  logger.error("Unhandled error", { status, message, stack: err.stack });
  res.status(status).json({ error: message });
}

/**
 * 404 handler — catches any unmatched routes.
 */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: "Not found" });
}
