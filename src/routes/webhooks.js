const express = require("express");
const router = express.Router();

router.post("/stripe", (req, res) => {
  res.json({ ok: true, message: "Stripe webhook received (stubbed)" });
});

module.exports = router;
