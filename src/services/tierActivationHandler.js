"use strict";

const logger = require("../utils/logger");
const { getCapabilities } = require("./capabilitiesMap");

/**
 * Process a single tier-activation event from a Baserow row.
 *
 * Expected row shape:
 *   { id, user_id, tier, status, activated_at }
 *
 * Returns true if the row was handled, false if it was skipped.
 */
async function handleTierActivation(row) {
  const { id, user_id: userId, tier, status } = row;

  if (status !== "pending") {
    logger.debug(`tierActivationHandler: row ${id} skipped (status="${status}")`);
    return false;
  }

  if (!userId || !tier) {
    logger.warn(`tierActivationHandler: row ${id} missing user_id or tier — skipping.`);
    return false;
  }

  const capabilities = getCapabilities(tier);

  logger.info(
    `tierActivationHandler: activating tier "${tier}" for user "${userId}" ` +
    `(row ${id}) — capabilities: [${capabilities.join(", ")}]`
  );

  // TODO: persist activation state (e.g. update Baserow row status to "active",
  //       write to an internal database, or emit an event to downstream services).

  return true;
}

module.exports = { handleTierActivation };
