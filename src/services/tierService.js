"use strict";

const TIER_HIERARCHY = ["free", "starter", "pro", "enterprise"];

/**
 * Resolve which tier applies based on Stripe subscription status or a
 * manually supplied tier label.
 */
function resolveTier(input) {
  const { tier, subscriptionStatus } = input || {};

  if (subscriptionStatus === "active" && tier) {
    const normalised = tier.toLowerCase();
    if (TIER_HIERARCHY.includes(normalised)) {
      return { tier: normalised, source: "stripe", active: true };
    }
  }

  const fallback = (tier || "free").toLowerCase();
  return {
    tier: TIER_HIERARCHY.includes(fallback) ? fallback : "free",
    source: "fallback",
    active: false,
  };
}

/**
 * Return the numeric rank of a tier (higher = more privileged).
 */
function tierRank(tier) {
  const idx = TIER_HIERARCHY.indexOf((tier || "free").toLowerCase());
  return idx === -1 ? 0 : idx;
}

module.exports = { resolveTier, tierRank, TIER_HIERARCHY };
