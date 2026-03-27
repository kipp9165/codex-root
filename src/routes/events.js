const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ events: [], timestamp: new Date().toISOString() });
});

router.post("/", (req, res) => {
  res.status(201).json({ ok: true, message: "Event recorded (stubbed)", timestamp: new Date().toISOString() });
});

module.exports = router;
