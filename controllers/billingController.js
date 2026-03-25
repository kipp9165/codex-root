const { nowIso } = require("../utils/timestamps");
const { getStripeClient } = require("../utils/stripe");

async function handleCheckoutSession(req, res, next) {
  try {
    const stripe = getStripeClient();

    // In a real system, you might accept priceId, mode, etc. from the request.
    // For now, we assume a single TEST price configured in Stripe.
    const { priceId, successUrl, cancelUrl } = req.body || {};

    if (!priceId || typeof priceId !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'priceId'. Expected a Stripe Price ID string."
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: successUrl || "https://example.com/success",
      cancel_url: cancelUrl || "https://example.com/cancel"
    });

    return res.status(200).json({
      url: session.url,
      id: session.id,
      meta: {
        service: "codex-root",
        module: "billing",
        action: "checkout",
        timestamp: nowIso()
      }
    });
  } catch (err) {
    console.error("Error in handleCheckoutSession:", err);
    return next(err);
  }
}

async function handleBillingPortal(req, res, next) {
  try {
    const stripe = getStripeClient();

    const { customerId } = req.query || {};
    const returnUrl =
      process.env.BILLING_PORTAL_RETURN_URL || "https://example.com/account";

    if (!customerId || typeof customerId !== "string") {
      return res.status(400).json({
        error: "Missing or invalid 'customerId'. Expected a Stripe Customer ID string."
      });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl
    });

    return res.status(200).json({
      url: portalSession.url,
      id: portalSession.id,
      meta: {
        service: "codex-root",
        module: "billing",
        action: "portal",
        timestamp: nowIso()
      }
    });
  } catch (err) {
    console.error("Error in handleBillingPortal:", err);
    return next(err);
  }
}

module.exports = {
  handleCheckoutSession,
  handleBillingPortal
};
