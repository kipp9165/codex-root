const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    stripe: { connected: false, version: "0.0.0" },
    timestamp: new Date().toISOString()
  });
});

router.get("/products", (req, res) => {
  res.json({ products: [], timestamp: new Date().toISOString() });
});

router.get("/prices", (req, res) => {
  res.json({ prices: [], timestamp: new Date().toISOString() });
});

module.exports = router;
