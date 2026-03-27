"use strict";

/**
 * Capabilities map — defines what features/permissions each tier unlocks.
 * Keys are canonical tier names (lowercase). Values are arrays of capability strings.
 */
const capabilitiesMap = {
  free: [
    "read:public_content",
    "post:basic_updates",
  ],
  starter: [
    "read:public_content",
    "post:basic_updates",
    "read:analytics_summary",
    "access:starter_modules",
  ],
  pro: [
    "read:public_content",
    "post:basic_updates",
    "read:analytics_summary",
    "access:starter_modules",
    "access:pro_modules",
    "write:advanced_config",
    "export:reports",
  ],
  enterprise: [
    "read:public_content",
    "post:basic_updates",
    "read:analytics_summary",
    "access:starter_modules",
    "access:pro_modules",
    "write:advanced_config",
    "export:reports",
    "admin:user_management",
    "admin:billing",
    "access:enterprise_modules",
    "api:unlimited",
  ],
};

/**
 * Return the capabilities for a given tier name.
 * Falls back to the "free" tier if the tier is unknown.
 */
function getCapabilities(tier) {
  const key = (tier || "").toLowerCase();
  return capabilitiesMap[key] || capabilitiesMap.free;
}

module.exports = { capabilitiesMap, getCapabilities };
