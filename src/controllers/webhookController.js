"use strict";

const { constructWebhookEvent } = require("../services/stripeService");
const { recordEvent } = require("../services/eventsService");
const { resolveTier } = require("../services/tierService");

async function handleStripeWebhook(req, res, next) {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({ error: "Bad Request", message: "Missing stripe-signature header" });
  }

  let event;
  try {
    event = constructWebhookEvent(req.body, signature);
  } catch (err) {
    return res.status(400).json({ error: "Webhook Error", message: err.message });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const tier = subscription.metadata?.tier || "starter";
        const resolved = resolveTier({ tier, subscriptionStatus: subscription.status });

        await recordEvent({
          type: "stripe.subscription.updated",
          userId: subscription.metadata?.userId || null,
          payload: {
            subscriptionId: subscription.id,
            status: subscription.status,
            resolvedTier: resolved.tier,
          },
          source: "stripe-webhook",
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await recordEvent({
          type: "stripe.subscription.deleted",
          userId: subscription.metadata?.userId || null,
          payload: { subscriptionId: subscription.id },
          source: "stripe-webhook",
        });
        break;
      }

      default:
        break;
    }

    return res.json({ ok: true, received: true, type: event.type });
  } catch (err) {
    return next(err);
  }
}

module.exports = { handleStripeWebhook };
