"use strict";

const { loadCapabilityMap, getCapabilitiesForTier } = require("../services/capabilityMapService");

async function loadMap(req, res, next) {
  try {
    const map = await loadCapabilityMap();
    return res.json({ ok: true, map });
  } catch (err) {
    return next(err);
  }
}

async function loadMapForTier(req, res, next) {
  try {
    const tier = req.params.tier || req.query.tier || req.headers["x-user-tier"] || "free";
    const capabilities = await getCapabilitiesForTier(tier);
    return res.json({ ok: true, tier, capabilities });
  } catch (err) {
    return next(err);
  }
}

module.exports = { loadMap, loadMapForTier };
