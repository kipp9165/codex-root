import { Router } from "express";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, APP_URL } from "../config/env.js";
import { getUserById } from "../services/users.js";
import { getSubscription } from "../services/subscriptions.js";
import { logger } from "../utils/logger.js";

const router = Router();
const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

/**
 * POST /billing/checkout
 * Creates a Stripe Checkout session for upgrading to pro/enterprise.
 */
router.post("/checkout", async (req, res, next) => {
  try {
    const userId = req.userId ?? req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { priceId } = req.body;
    if (!priceId) return res.status(400).json({ error: "priceId is required" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const sessionParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/billing/cancel`,
      metadata: { userId },
    };

    if (user.field_stripe_customer_id) {
      sessionParams.customer = user.field_stripe_customer_id;
    } else if (user.field_email) {
      sessionParams.customer_email = user.field_email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    logger.info("Checkout session created", { userId, sessionId: session.id });

    return res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /billing/portal
 * Creates a Stripe Customer Portal session for managing billing.
 */
router.post("/portal", async (req, res, next) => {
  try {
    const userId = req.userId ?? req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.field_stripe_customer_id) {
      return res.status(400).json({ error: "No billing account found. Please subscribe first." });
    }

    const subscription = await getSubscription(userId);
    if (!subscription) {
      return res.status(400).json({ error: "No active subscription found." });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.field_stripe_customer_id,
      return_url: `${APP_URL}/billing`,
    });
    logger.info("Portal session created", { userId });

    return res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
});

export default router;
