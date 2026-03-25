const { nowIso } = require("../utils/timestamps");

async function handleCheckoutSession(req, res, next) {
  try {
    // Placeholder: in production, create a Stripe Checkout Session here.
    const fakeCheckoutUrl = "https://dashboard.stripe.com/test/checkout/sessions/placeholder";

    return res.status(200).json({
      url: fakeCheckoutUrl,
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
    // Placeholder: in production, create a Stripe Billing Portal session here.
    const fakePortalUrl = "https://dashboard.stripe.com/test/billing/portal/placeholder";

    return res.status(200).json({
      url: fakePortalUrl,
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
