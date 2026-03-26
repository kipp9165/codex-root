import { Router } from "express";
import Stripe from "stripe";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /billing/checkout
 * Body: { priceId, successUrl, cancelUrl, customerEmail }
 * Returns: { url } → Stripe Checkout Session URL
 */
router.post("/checkout", async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl, customerEmail } = req.body;

    if (!priceId || !successUrl || !cancelUrl || !customerEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return res.status(500).json({ error: "Unable to create checkout session" });
  }
});

/**
 * POST /billing/portal
 * Body: { customerId, returnUrl }
 * Returns: { url } → Stripe Billing Portal URL
 */
router.post("/portal", async (req, res) => {
  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId || !returnUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Portal error:", err);
    return res.status(500).json({ error: "Unable to create portal session" });
  }
});

export default router;
