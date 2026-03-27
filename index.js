const express = require("express");
const app = express();

app.use(express.json());

// In-memory tier store for stubbed webhook/activation flow
const tierStore = {};

// GET /me — returns user profile for a given email
app.get("/me", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "email query parameter is required" });
  }
  res.json({
    email,
    tier: tierStore[email] || "free",
    stripe_customer_id: `cus_stub_${Buffer.from(email).toString("base64").slice(0, 10)}`,
    created_at: new Date().toISOString()
  });
});

// GET /capabilities — returns capability map for a given email
app.get("/capabilities", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: "email query parameter is required" });
  }
  const tier = tierStore[email] || "free";
  const capabilityMap = {
    email,
    tier,
    capabilities: {
      invention_radar: tier !== "free",
      deersafe: tier === "pro" || tier === "enterprise",
      codex_system: tier === "enterprise",
      api_access: tier !== "free",
      webhooks: tier !== "free"
    },
    updated_at: new Date().toISOString()
  };
  res.json(capabilityMap);
});

// POST /api/stripe/checkout — creates a Stripe checkout session (stubbed)
app.post("/api/stripe/checkout", (req, res) => {
  const { email, price_id } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  res.json({
    session_id: `cs_stub_${Date.now()}`,
    url: `https://checkout.stripe.com/pay/cs_stub_${Date.now()}#fidkdWxOYHwnPyd1blpxYHZxWjA0Tk1fZGFITGdxZnFSUkpcUDRVMX1pZzBBUk9xSnJGVV9HMWRV`,
    email,
    price_id: price_id || "price_stub",
    status: "open"
  });
});

// POST /api/stripe/portal — creates a Stripe billing portal session (stubbed)
app.post("/api/stripe/portal", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }
  res.json({
    session_id: `bps_stub_${Date.now()}`,
    url: `https://billing.stripe.com/session/bps_stub_${Date.now()}`,
    email,
    status: "active"
  });
});

// POST /api/webhooks/stripe — handles incoming Stripe webhook events
app.post("/api/webhooks/stripe", (req, res) => {
  const event = req.body;
  if (!event || !event.type) {
    return res.status(400).json({ error: "Invalid webhook payload" });
  }

  const result = { received: true, type: event.type, processed: false, tier_activated: null };

  if (
    event.type === "checkout.session.completed" ||
    event.type === "customer.subscription.updated" ||
    event.type === "invoice.payment_succeeded"
  ) {
    const email = event.data && event.data.object && event.data.object.customer_email;
    const newTier = event.data && event.data.object && event.data.object.metadata && event.data.object.metadata.tier;
    if (email && newTier) {
      tierStore[email] = newTier;
      result.processed = true;
      result.tier_activated = { email, tier: newTier };
    }
  }

  res.json(result);
});

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

// Stubbed Hookdeck Webhook
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

module.exports = { app, server, tierStore };
