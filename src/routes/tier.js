const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    tier: "free",
    limits: {},
    timestamp: new Date().toISOString()
  });
});

router.get("/:tierId", (req, res) => {
  res.json({
    tier: req.params.tierId,
    limits: {},
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
