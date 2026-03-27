"use strict";

const Stripe = require("stripe");

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return Stripe(key);
}

/**
 * Create a Stripe Checkout Session.
 */
async function createCheckoutSession({ priceId, customerId, successUrl, cancelUrl, metadata }) {
  const stripe = getStripe();

  const params = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || `${process.env.APP_URL}/success`,
    cancel_url: cancelUrl || `${process.env.APP_URL}/cancel`,
    metadata: metadata || {},
  };

  if (customerId) {
    params.customer = customerId;
  }

  return stripe.checkout.sessions.create(params);
}

/**
 * Create a Stripe Billing Portal Session.
 */
async function createPortalSession({ customerId, returnUrl }) {
  const stripe = getStripe();

  if (!customerId) {
    throw new Error("customerId is required for portal session");
  }

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || `${process.env.APP_URL}/billing`,
  });
}

/**
 * Verify a Stripe webhook signature and return the event.
 */
function constructWebhookEvent(rawBody, signature) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}

module.exports = { createCheckoutSession, createPortalSession, constructWebhookEvent };
