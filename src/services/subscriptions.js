import { listRows, createRow, updateRow } from "./baserowClient.js";
import { BASEROW_SUBSCRIPTIONS_TABLE_ID } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Get the active subscription for a user.
 * @param {string} userId
 * @returns {object|null}
 */
export async function getSubscription(userId) {
  const data = await listRows(BASEROW_SUBSCRIPTIONS_TABLE_ID, {
    filter__field_user_id__equal: userId,
    filter__field_status__equal: "active",
    size: 1,
    order_by: "-field_created_at",
  });
  return data.results?.[0] ?? null;
}

/**
 * Upsert subscription record keyed on Stripe subscription ID.
 * @param {string} stripeSubscriptionId
 * @param {object} fields
 * @returns {object}
 */
export async function upsertSubscription(stripeSubscriptionId, fields = {}) {
  const data = await listRows(BASEROW_SUBSCRIPTIONS_TABLE_ID, {
    filter__field_stripe_subscription_id__equal: stripeSubscriptionId,
    size: 1,
  });
  const existing = data.results?.[0];
  const payload = {
    field_stripe_subscription_id: stripeSubscriptionId,
    field_updated_at: new Date().toISOString(),
    ...fields,
  };
  if (existing) {
    logger.debug("Updating subscription", { stripeSubscriptionId, rowId: existing.id });
    return updateRow(BASEROW_SUBSCRIPTIONS_TABLE_ID, existing.id, payload);
  }
  logger.info("Creating subscription", { stripeSubscriptionId });
  return createRow(BASEROW_SUBSCRIPTIONS_TABLE_ID, {
    ...payload,
    field_created_at: new Date().toISOString(),
  });
}

/**
 * Cancel a subscription record by Stripe subscription ID.
 * @param {string} stripeSubscriptionId
 */
export async function cancelSubscription(stripeSubscriptionId) {
  const data = await listRows(BASEROW_SUBSCRIPTIONS_TABLE_ID, {
    filter__field_stripe_subscription_id__equal: stripeSubscriptionId,
    size: 1,
  });
  const existing = data.results?.[0];
  if (!existing) {
    logger.warn("cancelSubscription: record not found", { stripeSubscriptionId });
    return;
  }
  return updateRow(BASEROW_SUBSCRIPTIONS_TABLE_ID, existing.id, {
    field_status: "canceled",
    field_updated_at: new Date().toISOString(),
  });
}
