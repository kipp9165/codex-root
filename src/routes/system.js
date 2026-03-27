const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "online",
    version: process.env.npm_package_version || "0.5.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

router.get("/health", (req, res) => {
  res.json({ healthy: true, timestamp: new Date().toISOString() });
});

module.exports = router;
