import { listRows, createRow, updateRow } from "./baserowClient.js";
import { BASEROW_USERS_TABLE_ID } from "../config/env.js";
import { logger } from "../utils/logger.js";

/**
 * Update a user's tier field in Baserow.
 * @param {string} userId
 * @param {string} tier
 */
export async function setUserTier(userId, tier) {
  const existing = await getUserById(userId);
  if (!existing) {
    logger.warn("setUserTier: user not found", { userId });
    return;
  }
  logger.info("Setting user tier", { userId, tier });
  return updateRow(BASEROW_USERS_TABLE_ID, existing.id, {
    field_tier: tier,
    field_updated_at: new Date().toISOString(),
  });
}

/**
 * Find a user record by their external auth ID (e.g. Clerk / JWT sub).
 * @param {string} userId
 * @returns {object|null}
 */
export async function getUserById(userId) {
  const data = await listRows(BASEROW_USERS_TABLE_ID, {
    filter__field_user_id__equal: userId,
    size: 1,
  });
  return data.results?.[0] ?? null;
}

/**
 * Upsert a user record. Creates on first login, updates on subsequent calls.
 * @param {string} userId
 * @param {object} profile  { email, name, ... }
 * @returns {object}
 */
export async function upsertUser(userId, profile = {}) {
  const existing = await getUserById(userId);
  const fields = {
    field_user_id: userId,
    field_email: profile.email ?? "",
    field_name: profile.name ?? "",
    field_updated_at: new Date().toISOString(),
  };
  if (existing) {
    logger.debug("Updating existing user", { userId, rowId: existing.id });
    return updateRow(BASEROW_USERS_TABLE_ID, existing.id, fields);
  }
  logger.info("Creating new user", { userId });
  return createRow(BASEROW_USERS_TABLE_ID, {
    ...fields,
    field_created_at: new Date().toISOString(),
    field_tier: "free",
  });
}
