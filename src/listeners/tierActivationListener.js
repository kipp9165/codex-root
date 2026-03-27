"use strict";

const logger = require("../utils/logger");
const { fetchTableRows } = require("../services/baserowClient");
const { handleTierActivation } = require("../services/tierActivationHandler");

const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS, 10) || 30000;

let pollTimer = null;

/**
 * Run one polling cycle: fetch rows from Baserow and process each one.
 */
async function poll() {
  logger.info("tierActivationListener: polling Baserow for tier activation events...");

  let rows;
  try {
    rows = await fetchTableRows();
  } catch (err) {
    logger.error("tierActivationListener: failed to fetch rows —", err.message);
    return;
  }

  if (!rows.length) {
    logger.info("tierActivationListener: no rows returned.");
    return;
  }

  logger.info(`tierActivationListener: processing ${rows.length} row(s).`);

  for (const row of rows) {
    try {
      await handleTierActivation(row);
    } catch (err) {
      logger.error(`tierActivationListener: error handling row ${row.id} —`, err.message);
    }
  }
}

/**
 * Start the listener. Runs an immediate poll, then repeats on the interval.
 */
function start() {
  logger.info(
    `tierActivationListener: starting — poll interval ${POLL_INTERVAL_MS}ms.`
  );
  poll();
  pollTimer = setInterval(poll, POLL_INTERVAL_MS);
}

/**
 * Stop the listener and clear the interval.
 */
function stop() {
  if (pollTimer !== null) {
    clearInterval(pollTimer);
    pollTimer = null;
    logger.info("tierActivationListener: stopped.");
  }
}

module.exports = { start, stop };
