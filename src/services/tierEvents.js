import baserowRequest from "./baserow.js";

const TIER_ACTIVATIONS_TABLE_ID = process.env.BASEROW_TIER_ACTIVATIONS_TABLE_ID;

export async function emitTierActivation({ userId, oldTier, newTier, source }) {
  if (!userId || !newTier || oldTier === newTier) return;

  return baserowRequest(
    "POST",
    `/database/rows/table/${TIER_ACTIVATIONS_TABLE_ID}/?user_field_names=true`,
    {
      user: userId,
      old_tier: oldTier || "",
      new_tier: newTier,
      source: source || "stripe",
      timestamp: new Date().toISOString()
    }
  );
}
