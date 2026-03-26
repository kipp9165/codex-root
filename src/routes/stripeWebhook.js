import { Router } from "express";
import Stripe from "stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /stripe/webhook
 * Stripe sends webhook events here.
 * Requires raw body — mount with express.raw({ type: "application/json" })
 */
router.post("/", async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      console.log("Checkout completed:", session.id);

      // Example: you can later:
      // - Look up user by session.customer_email
      // - Store stripe_customer_id (session.customer)
      // - Fetch subscription via session.subscription

      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;

      const stripeCustomerId = subscription.customer;
      const price = subscription.items?.data?.[0]?.price;
      const priceId = price?.id;
      const tier =
        price?.metadata?.tier ||
        (priceId === "price_starter_monthly"
          ? "starter"
          : priceId === "price_pro_monthly"
          ? "pro"
          : "unknown");

      console.log("Subscription event:", {
        type: event.type,
        stripeCustomerId,
        priceId,
        tier,
        status: subscription.status
      });

      // Later:
      // - Find user by stripeCustomerId
      // - Upsert subscription record
      // - Update user.current_tier = tier

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;

      console.log("Subscription canceled:", {
        stripeCustomerId,
        stripeSubscriptionId: subscription.id
      });

      // Later:
      // - Mark subscription as canceled
      // - Optionally downgrade user.current_tier to "free"

      break;
    }

    default:
      console.log("Unhandled event type:", event.type);
  }

  res.json({ received: true });
});

export default router;
