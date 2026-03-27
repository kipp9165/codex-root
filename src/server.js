import express from "express";
import { PORT } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import meRouter from "./routes/me.js";
import billingRouter from "./routes/billing.js";
import capabilitiesRouter from "./routes/capabilities.js";
import stripeWebhookRouter from "./routes/stripeWebhook.js";

const app = express();

// Stripe webhook route must come before express.json() to receive raw body
app.use("/stripe/webhook", stripeWebhookRouter);

// Body parsing
app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), ts: new Date().toISOString() });
});

// API routes
app.use("/me", meRouter);
app.use("/billing", billingRouter);
app.use("/capabilities", capabilitiesRouter);

// Legacy Codex state endpoints (backward compatibility)
app.get("/api/codex/state", (_req, res) => {
  res.json({
    kernel: { version: "1.0.0", status: "online", uptime: process.uptime(), ts: new Date().toISOString() },
    services: { stripe: "active", hookdeck: "active", billing: "active" },
  });
});

// 404 + error handler (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Codex Root v1.0 running on port ${PORT}`);
});

export default app;
