const { nowIso } = require("../utils/timestamps");
const { getStripeClient, getStripeWebhookSecret } = require("../utils/stripe");

async function handleStripeWebhook(req, res, next) {
  try {
    const stripe = getStripeClient();
    const webhookSecret = getStripeWebhookSecret();

    const sig = req.headers["stripe-signature"];
    if (!sig) {
      return res.status(400).json({
        error: "Missing Stripe-Signature header."
      });
    }

    let event;

    try {
      // req.body is a raw Buffer when the webhook route uses express.raw().
      // This ensures the signature is verified against the original bytes.
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );
    } catch (err) {
      console.error("Stripe webhook signature verification failed:", err);
      return res.status(400).json({
        error: "Invalid Stripe webhook signature."
      });
    }

    console.log("Received Stripe event:", {
      id: event.id,
      type: event.type,
      created: event.created
    });

    // Basic subscription lifecycle scaffold
    switch (event.type) {
      case "checkout.session.completed":
        // Handle successful checkout
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        // Handle subscription lifecycle
        break;
      case "invoice.payment_succeeded":
      case "invoice.payment_failed":
        // Handle invoice events
        break;
      default:
        break;
    }

    return res.status(200).json({
      received: true,
      eventId: event.id,
      type: event.type,
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
