const express = require("express");
const app = express();

app.use(express.json());

// Codex Root v0.5 — State Endpoint
app.get("/api/codex/state", (req, res) => {
  res.json({
    kernel: {
      version: "0.5.0",
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

// Stubbed Stripe/Hookdeck Webhook
app.post("/api/codex/hookdeck/connect", (req, res) => {
  res.json({ ok: true, message: "Webhook received (stubbed)" });
});

// Root
app.get("/", (req, res) => {
  res.send("Codex Root v0.5 is running.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Codex Root v0.5 running on port ${PORT}`);
});
