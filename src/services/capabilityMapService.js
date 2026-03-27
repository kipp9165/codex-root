"use strict";

/**
 * Static capability map keyed by tier.
 * In production this can be loaded from Baserow or a remote JSON source
 * via the CAPABILITY_MAP_URL environment variable.
 */
const STATIC_CAPABILITY_MAP = {
  free: ["read:public", "events:log"],
  starter: ["read:public", "events:log", "capabilities:read", "stripe:portal"],
  pro: [
    "read:public",
    "events:log",
    "capabilities:read",
    "stripe:portal",
    "tier:resolve",
    "capability-map:load",
  ],
  enterprise: [
    "read:public",
    "events:log",
    "capabilities:read",
    "stripe:portal",
    "tier:resolve",
    "capability-map:load",
    "system:ping",
    "admin:all",
  ],
};

/**
 * Load the capability map. If CAPABILITY_MAP_URL is set the map is fetched
 * from that URL; otherwise the bundled static map is returned.
 */
async function loadCapabilityMap() {
  const url = process.env.CAPABILITY_MAP_URL;
  if (url) {
    const axios = require("axios");
    const { data } = await axios.get(url, { timeout: 5000 });
    return data;
  }
  return STATIC_CAPABILITY_MAP;
}

/**
 * Return the capabilities available for a given tier.
 */
async function getCapabilitiesForTier(tier) {
  const map = await loadCapabilityMap();
  const normalised = (tier || "free").toLowerCase();
  return map[normalised] || map["free"] || [];
}

module.exports = { loadCapabilityMap, getCapabilitiesForTier };
