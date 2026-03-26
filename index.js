const express = require("express");
const app = express();

app.use(express.json());

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

// User lookup
app.get("/me", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "email required" });
  res.json({
    email,
    tier: "free",
    stripeCustomerId: null
  });
});

// Billing checkout
app.post("/billing/checkout", (req, res) => {
  const { priceId, customerEmail, successUrl, cancelUrl } = req.body;
  if (!priceId || !customerEmail) {
    return res.status(400).json({ error: "priceId and customerEmail required" });
  }
  // Stub: return successUrl as placeholder until Stripe is wired
  res.json({ url: successUrl || "/" });
});

// Billing portal
app.post("/billing/portal", (req, res) => {
  const { customerId, returnUrl } = req.body;
  if (!customerId) {
    return res.status(400).json({ error: "customerId required" });
  }
  // Stub: return returnUrl as placeholder until Stripe is wired
  res.json({ url: returnUrl || "/" });
});

// Root
app.get("/", (req, res) => {
  res.send("Codex Root v0.7 is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Codex Root v0.7 running on port ${PORT}`);
});
