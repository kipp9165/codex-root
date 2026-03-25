/**
 * Codex Root v1.1
 * Core backend engine for Invention Radar / Codex Labs
 */

const express = require("express");
const { applyCors } = require("./middleware/cors");
const { requestLogger } = require("./middleware/logging");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const routes = require("./routes");

const app = express();

// ----- Core middleware -----
// Raw body required for Stripe webhook signature verification
app.use("/webhooks/stripe", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "1mb" }));
applyCors(app);
app.use(requestLogger);

// ----- Routes -----
app.use("/", routes);

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

// ----- Server bootstrap -----
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Codex Root v1.1 running on port ${PORT}`);
});

module.exports = app;
