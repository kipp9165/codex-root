"use strict";

const { getCapabilitiesForTier } = require("../services/capabilityMapService");

async function getCapabilities(req, res, next) {
  try {
    const tier = req.headers["x-user-tier"] || req.query.tier || "free";
    const capabilities = await getCapabilitiesForTier(tier);
    return res.json({ ok: true, tier, capabilities });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getCapabilities };
