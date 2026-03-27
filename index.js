const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const meRouter = require("./src/routes/me");
const capabilitiesRouter = require("./src/routes/capabilities");
const stripeRouter = require("./src/routes/stripe");
const webhooksRouter = require("./src/routes/webhooks");
const tierRouter = require("./src/routes/tier");
const capabilityMapRouter = require("./src/routes/capabilityMap");
const eventsRouter = require("./src/routes/events");
const systemRouter = require("./src/routes/system");

app.use("/me", meRouter);
app.use("/capabilities", capabilitiesRouter);
app.use("/stripe", stripeRouter);
app.use("/webhooks", webhooksRouter);
app.use("/tier", tierRouter);
app.use("/capability-map", capabilityMapRouter);
app.use("/events", eventsRouter);
app.use("/system", systemRouter);

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

// Error middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Codex Root v0.7 running on port ${PORT}`);
});
