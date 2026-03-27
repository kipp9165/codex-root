"use strict";

const { createCheckoutSession, createPortalSession } = require("../services/stripeService");

async function createCheckout(req, res, next) {
  try {
    const { priceId, customerId, successUrl, cancelUrl, metadata } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: "Bad Request", message: "priceId is required" });
    }

    const session = await createCheckoutSession({ priceId, customerId, successUrl, cancelUrl, metadata });
    return res.json({ ok: true, url: session.url, sessionId: session.id });
  } catch (err) {
    return next(err);
  }
}

async function createPortal(req, res, next) {
  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId) {
      return res.status(400).json({ error: "Bad Request", message: "customerId is required" });
    }

    const session = await createPortalSession({ customerId, returnUrl });
    return res.json({ ok: true, url: session.url });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createCheckout, createPortal };
