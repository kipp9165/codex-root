"use strict";

const { logEvent } = require("./baserowService");

/**
 * Structured event schema validation and persistence.
 */
async function recordEvent({ type, userId, payload, source }) {
  if (!type) {
    throw new Error("Event type is required");
  }

  const event = {
    type,
    user_id: userId || null,
    payload: payload ? JSON.stringify(payload) : null,
    source: source || "api",
    timestamp: new Date().toISOString(),
  };

  const result = await logEvent(event);
  return { event, stored: result !== null, rowId: result?.id || null };
}

module.exports = { recordEvent };
