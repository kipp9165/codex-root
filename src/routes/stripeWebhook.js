import { Router } from "express";
import Stripe from "stripe";
import { upsertUserFromStripe } from "../services/users.js";
import { upsertSubscription } from "../services/subscriptions.js";
import { hasProcessedEvent, recordWebhookEvent } from "../services/webhookEvents.js";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

router.post("/", async (req, res) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Idempotency
  if (await hasProcessedEvent(event.id)) {
    return res.json({ received: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_details?.email;
      const stripeCustomerId = session.customer;

      if (email) {
        await upsertUserFromStripe({ email, stripeCustomerId });
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;
      const price = subscription.items?.data?.[0]?.price;
      const tier = price?.metadata?.tier || "unknown";

      const email = subscription.customer_email;
      if (!email) {
        console.log("Skipping upsert: no customer email on subscription", subscription.id);
        break;
      }

      const user = await upsertUserFromStripe({ email, stripeCustomerId });

      await upsertSubscription({
        userId: user.id,
        subscription,
        tier
      });

      break;
    }

    case "customer.subscription.deleted": {
      // Optional: downgrade user tier here
      break;
    }

    default:
      console.log("Unhandled event type:", event.type);
  }

  await recordWebhookEvent(event);
  return res.json({ received: true });
});

export default router;
