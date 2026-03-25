const express = require("express");
const { handleStripeWebhook } = require("../controllers/webhookController");

const router = express.Router();

// POST /webhooks/stripe
router.post("/stripe", handleStripeWebhook);

module.exports = router;
