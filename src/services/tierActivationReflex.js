import { listRows, createRow } from "./baserowClient.js";
import { upsertUser, setUserTier } from "./users.js";
import { getCapabilitiesForTier } from "./capabilities.js";
import { BASEROW_TIER_ACTIVATIONS_TABLE_ID } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Tier Activation Reflex
 *
 * Triggered when a Stripe event changes a user's subscription tier.
 * Persists a TierActivation record and refreshes the user's tier + capabilities.
 *
 * @param {string} userId
 * @param {string} tier  "free" | "pro" | "enterprise"
 * @param {string} stripeSubscriptionId
 * @param {string} [reason]
 * @returns {object}  { user, tier, capabilities, activation }
 */
export async function triggerTierActivation(userId, tier, stripeSubscriptionId, reason = "stripe_event") {
  logger.info("TierActivationReflex: activating tier", { userId, tier, stripeSubscriptionId, reason });

  // Idempotency check — skip if the latest activation for this subscription is already this tier
  const existing = await listRows(BASEROW_TIER_ACTIVATIONS_TABLE_ID, {
    filter__field_stripe_subscription_id__equal: stripeSubscriptionId,
    filter__field_tier__equal: tier,
    size: 1,
    order_by: "-field_activated_at",
  });

  if (existing.results?.length > 0) {
    logger.debug("TierActivationReflex: already activated, skipping duplicate", {
      userId,
      tier,
      stripeSubscriptionId,
    });
    const activation = existing.results[0];
    const capabilities = getCapabilitiesForTier(tier);
    return { userId, tier, capabilities, activation };
  }

  // Create activation record
  const activation = await createRow(BASEROW_TIER_ACTIVATIONS_TABLE_ID, {
    field_user_id: userId,
    field_tier: tier,
    field_stripe_subscription_id: stripeSubscriptionId,
    field_reason: reason,
    field_activated_at: new Date().toISOString(),
  });

  // Update the user record tier
  await upsertUser(userId, {});
  await setUserTier(userId, tier);

  // Resolve capabilities
  const capabilities = getCapabilitiesForTier(tier);

  logger.info("TierActivationReflex: tier activated", { userId, tier, capabilities });
  return { userId, tier, capabilities, activation };
}
