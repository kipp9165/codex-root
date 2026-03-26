import express from "express";
import cors from "cors";
import morgan from "morgan";

import { stripeWebhookMiddleware, handleStripeWebhook } from "./routes/stripeWebhook.js";
import healthRouter from "./routes/health.js";

const app = express();

// Webhook route MUST come before express.json()
app.post("/webhooks/stripe", stripeWebhookMiddleware, handleStripeWebhook);

// Global middleware for the rest of the app
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health + basic routes
app.use("/health", healthRouter);

app.get("/", (req, res) => {
  res.json({
    service: "codex-root-v1",
    status: "ok",
    message: "Codex Root v1 backend is running"
  });
});

export default app;
