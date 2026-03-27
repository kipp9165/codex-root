require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { version } = require("./package.json");

const app = express();

// ── Stripe webhook route must receive the raw body before JSON parsing ──
const webhooksRouter = require("./src/routes/webhooks");
app.use("/webhooks", express.raw({ type: "application/json" }), webhooksRouter);

// ── Global middleware ──
app.use(cors());
app.use(express.json());

// ── Application routes ──
app.use("/me", require("./src/routes/me"));
app.use("/capabilities", require("./src/routes/capabilities"));
app.use("/stripe", require("./src/routes/stripe"));
app.use("/tier", require("./src/routes/tier"));
app.use("/capability-map", require("./src/routes/capabilityMap"));
app.use("/events", require("./src/routes/events"));
app.use("/system", require("./src/routes/system"));

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

// ── Root ──
app.get("/", (req, res) => {
  res.send(`Codex Root v${version} is running.`);
});

// ── Global error handler ──
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err);
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    error: err.name || "InternalServerError",
    message: err.message || "An unexpected error occurred",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Codex Root v${version} running on port ${PORT}`);
});
