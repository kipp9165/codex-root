/**
 * Capability map: defines which features each tier unlocks.
 * Tiers: free | pro | enterprise
 */
export const CAPABILITY_MAP = {
  free: [
    "basic_search",
    "invention_radar_read",
    "profile_view",
  ],
  pro: [
    "basic_search",
    "invention_radar_read",
    "invention_radar_export",
    "profile_view",
    "profile_edit",
    "ai_assistant_basic",
    "billing_manage",
  ],
  enterprise: [
    "basic_search",
    "invention_radar_read",
    "invention_radar_export",
    "invention_radar_admin",
    "profile_view",
    "profile_edit",
    "ai_assistant_basic",
    "ai_assistant_advanced",
    "billing_manage",
    "team_management",
    "api_access",
    "analytics_full",
  ],
};

const TIER_ORDER = ["free", "pro", "enterprise"];

/**
 * Get capabilities for a given tier.
 * @param {string} tier
 * @returns {string[]}
 */
export function getCapabilitiesForTier(tier) {
  return CAPABILITY_MAP[tier] ?? CAPABILITY_MAP.free;
}

/**
 * Check whether a tier has a specific capability.
 * @param {string} tier
 * @param {string} capability
 * @returns {boolean}
 */
export function tierHasCapability(tier, capability) {
  return getCapabilitiesForTier(tier).includes(capability);
}

/**
 * Compare two tiers. Returns positive if a > b, negative if a < b, 0 if equal.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function compareTiers(a, b) {
  return TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b);
}
