"use strict";

const express = require("express");
const router = express.Router();
const { handleStripeWebhook } = require("../controllers/webhookController");

// Raw body is needed for Stripe signature verification.
// index.js mounts this router BEFORE express.json(), passing the raw buffer
// via express.raw({ type: "application/json" }).
router.post("/stripe", handleStripeWebhook);

module.exports = router;
