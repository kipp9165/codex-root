"use strict";

const { resolveTier } = require("../services/tierService");

async function getTierResolution(req, res, next) {
  try {
    const tier = req.body.tier || req.query.tier || req.headers["x-user-tier"] || "free";
    const subscriptionStatus = req.body.subscriptionStatus || req.query.subscriptionStatus || null;

    const resolved = resolveTier({ tier, subscriptionStatus });
    return res.json({ ok: true, resolved });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getTierResolution };
