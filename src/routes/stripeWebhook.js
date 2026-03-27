import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_PRO,
  STRIPE_PRICE_ENTERPRISE,
  BASEROW_USERS_TABLE_ID,
} from "../config/env.js";
import { upsertSubscription, cancelSubscription } from "../services/subscriptions.js";
import { updateRow } from "../services/baserowClient.js";
import { triggerTierActivation } from "../services/tierActivationReflex.js";
import { getUserById } from "../services/users.js";
import { logger } from "../utils/logger.js";

const router = Router();
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

/**
 * POST /stripe/webhook
 * Receives Stripe events via Hookdeck or direct delivery.
 * Uses express.raw() to preserve the raw body for signature verification.
 */
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.warn("Stripe webhook signature verification failed", { error: err.message });
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  logger.info("Stripe webhook received", { type: event.type, id: event.id });

  try {
    await handleStripeEvent(event);
  } catch (err) {
    logger.error("Stripe webhook handler error", { type: event.type, error: err.message });
    return res.status(500).json({ error: "Webhook handler error" });
  }

  return res.json({ received: true });
});

/**
 * Map Stripe price ID to internal tier.
 * @param {object} subscription  Stripe subscription object
 * @returns {string}
 */
function resolveTierFromSubscription(subscription) {
  const priceId = subscription.items?.data?.[0]?.price?.id ?? "";
  if (STRIPE_PRICE_ENTERPRISE && priceId === STRIPE_PRICE_ENTERPRISE) return "enterprise";
  if (STRIPE_PRICE_PRO && priceId === STRIPE_PRICE_PRO) return "pro";
  return "pro";
}

/**
 * Route Stripe events to handlers.
 * @param {object} event  Stripe event
 */
async function handleStripeEvent(event) {
  const { type, data } = event;
  const obj = data.object;

  switch (type) {
    case "checkout.session.completed": {
      const session = obj;
      const userId = session.metadata?.userId;
      if (!userId) {
        logger.warn("checkout.session.completed: no userId in metadata");
        break;
      }
      if (session.customer) {
        const user = await getUserById(userId);
        if (user) {
          await updateRow(BASEROW_USERS_TABLE_ID, user.id, {
            field_stripe_customer_id: session.customer,
            field_updated_at: new Date().toISOString(),
          });
        }
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = obj;
      const userId = subscription.metadata?.userId;
      if (!userId) {
        logger.warn(`${type}: no userId in subscription metadata`);
        break;
      }
      const tier = resolveTierFromSubscription(subscription);
      await upsertSubscription(subscription.id, {
        field_user_id: userId,
        field_status: subscription.status,
        field_tier: tier,
        field_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      });
      if (subscription.status === "active") {
        await triggerTierActivation(userId, tier, subscription.id, type);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = obj;
      await cancelSubscription(subscription.id);
      const userId = subscription.metadata?.userId;
      if (userId) {
        await triggerTierActivation(userId, "free", subscription.id, "subscription_canceled");
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = obj;
      const subscriptionId = invoice.subscription;
      if (subscriptionId) {
        await upsertSubscription(subscriptionId, { field_status: "past_due" });
      }
      logger.warn("Invoice payment failed", { subscriptionId });
      break;
    }

    default:
      logger.debug("Unhandled Stripe event type", { type });
  }
}

export default router;
