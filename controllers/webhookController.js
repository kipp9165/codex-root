const { nowIso } = require("../utils/timestamps");

async function handleStripeWebhook(req, res, next) {
  try {
    // NOTE: In production, you must verify the Stripe signature header
    // and parse the event using the Stripe SDK.
    // For now, this is a safe placeholder that logs and acknowledges.

    console.log("Received Stripe webhook payload:", req.body);

    return res.status(200).json({
      received: true,
      meta: {
        service: "codex-root",
        module: "webhooks",
        provider: "stripe",
        timestamp: nowIso()
      }
    });
  } catch (err) {
    console.error("Error in handleStripeWebhook:", err);
    return next(err);
  }
}

module.exports = {
  handleStripeWebhook
};
