import express from "express";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("Missing required environment variable: STRIPE_WEBHOOK_SECRET");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Raw body middleware for Stripe + Hookdeck.
 * This MUST be used only on /webhooks/stripe and before any express.json().
 */
export const stripeWebhookMiddleware = express.raw({ type: "application/json" });

/**
 * Unified webhook handler:
 * - If stripe-signature header exists → verify with STRIPE_WEBHOOK_SECRET
 * - If not (Hookdeck forwarding) → accept and parse JSON without Stripe verification
 */
export const handleStripeWebhook = async (req, res) => {
  try {
    const rawBody = req.body;
    const stripeSig = req.headers["stripe-signature"];

    let event;

    if (stripeSig) {
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          stripeSig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("Verified Stripe event:", event.type);
      } catch (err) {
        console.error("Stripe signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      try {
        const parsed = JSON.parse(rawBody.toString());
        event = parsed;
        console.log("Hookdeck forwarded event:", event.type);
      } catch (err) {
        console.error("Failed to parse Hookdeck event:", err.message);
        return res.status(400).send("Invalid Hookdeck event payload");
      }
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("Checkout completed:", session.id);
        break;
      }

      case "customer.subscription.created": {
        const subscription = event.data.object;
        console.log("Subscription created:", subscription.id);
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).send("Internal Server Error");
  }
};
