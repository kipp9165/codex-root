"use strict";

const axios = require("axios");

const BASEROW_API_URL = process.env.BASEROW_API_URL || "https://api.baserow.io";
const BASEROW_TOKEN = process.env.BASEROW_TOKEN || "";
const EVENTS_TABLE_ID = process.env.BASEROW_EVENTS_TABLE_ID || "";

/**
 * Write a row to the Baserow Events table.
 * Silently returns null when credentials are not configured so that the
 * application can continue without Baserow in development.
 */
async function logEvent(event) {
  if (!BASEROW_TOKEN || !EVENTS_TABLE_ID) {
    return null;
  }

  const url = `${BASEROW_API_URL}/api/database/rows/table/${EVENTS_TABLE_ID}/?user_field_names=true`;

  const { data } = await axios.post(url, event, {
    headers: {
      Authorization: `Token ${BASEROW_TOKEN}`,
      "Content-Type": "application/json",
    },
    timeout: 8000,
  });

  return data;
}

module.exports = { logEvent };
