import express from "express";
import healthRouter from "./routes/health.js";
import billingRouter from "./routes/billing.js";
import meRouter from "./routes/me.js";
import stripeWebhookRouter from "./routes/stripeWebhook.js";
import tierRouter from "./routes/tier.js";

const app = express();

// Stripe webhooks require raw body — mount before express.json()
app.use("/api/codex/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhookRouter);

app.use(express.json());

app.use("/health", healthRouter);
app.use("/billing", billingRouter);
app.use("/me", meRouter);
app.use("/tier", tierRouter);

// Codex Root v0.7 — State Endpoint
app.get("/api/codex/state", (req, res) => {
  res.json({
    kernel: {
      version: "0.7.0",
      status: "online",
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    },
    services: {
      stripe: "stubbed",
      hookdeck: "stubbed",
      billing: "inactive"
    }
  });
});

// Billing State
app.get("/api/codex/billing/state", (req, res) => {
  res.json({
    billing: {
      status: "inactive",
      timestamp: new Date().toISOString()
    }
  });
});

// Modules List
app.get("/api/codex/modules", (req, res) => {
  res.json({
    modules: ["kernel", "stripe", "hookdeck", "billing"],
    timestamp: new Date().toISOString()
  });
});

// Stripe State
app.get("/api/codex/stripe/state", (req, res) => {
  res.json({
    stripe: {
      version: "0.0.0",
      connected: false,
      products: [],
      timestamp: new Date().toISOString()
    }
  });
});

// Hookdeck State
app.get("/api/codex/hookdeck/state", (req, res) => {
  res.json({
    hookdeck: {
      version: "0.0.0",
      connected: false,
      endpoints: [],
      timestamp: new Date().toISOString()
    }
  });
});

// Integrations Overview
app.get("/api/codex/integrations", (req, res) => {
  res.json({
    integrations: {
      stripe: { connected: false, version: "0.0.0" },
      hookdeck: { connected: false, version: "0.0.0" }
    },
    timestamp: new Date().toISOString()
  });
});

// Stubbed Stripe/Hookdeck Webhook
app.post("/api/codex/hookdeck/connect", (req, res) => {
  res.json({ ok: true, message: "Webhook received (stubbed)" });
});

// Root
app.get("/", (req, res) => {
  res.send("Codex Root v0.7 is running.");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Codex Root v0.7 running on port ${PORT}`);
});
server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

export default app;
