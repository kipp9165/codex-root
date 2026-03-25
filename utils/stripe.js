const Stripe = require("stripe");

let stripeClient;

function getStripeClient() {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not set. Set it to your Stripe TEST secret key."
      );
    }
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2023-10-16"
    });
  }
  return stripeClient;
}

function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      "STRIPE_WEBHOOK_SECRET is not set. Set it to your Stripe TEST webhook signing secret."
    );
  }
  return secret;
}

module.exports = {
  getStripeClient,
  getStripeWebhookSecret
};
