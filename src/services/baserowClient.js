"use strict";

require("dotenv/config");
const axios = require("axios");
const logger = require("../utils/logger");

const BASEROW_API_URL = process.env.BASEROW_API_URL || "https://api.baserow.io";
const BASEROW_TOKEN   = process.env.BASEROW_TOKEN || "";
const TABLE_ID        = process.env.BASEROW_TABLE_ID || "";

if (!BASEROW_TOKEN) {
  logger.warn("baserowClient: BASEROW_TOKEN is not set — fetchTableRows will throw until configured.");
}
if (!TABLE_ID) {
  logger.warn("baserowClient: BASEROW_TABLE_ID is not set — fetchTableRows will throw until configured.");
}

const client = axios.create({
  baseURL: `${BASEROW_API_URL}/api`,
  headers: {
    Authorization: `Token ${BASEROW_TOKEN}`,
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

/**
 * Fetch all rows from the configured Baserow table.
 * Returns an array of row objects on success, or throws on failure.
 * Throws a descriptive Error if TABLE_ID or BASEROW_TOKEN is not configured.
 */
async function fetchTableRows() {
  if (!TABLE_ID) {
    throw new Error(
      "baserowClient: BASEROW_TABLE_ID is not configured — cannot build API path."
    );
  }
  if (!BASEROW_TOKEN) {
    throw new Error(
      "baserowClient: BASEROW_TOKEN is not configured — cannot authenticate with Baserow."
    );
  }
  const response = await client.get(`/database/rows/table/${TABLE_ID}/`, {
    params: { user_field_names: true },
  });
  return response.data.results || [];
}

module.exports = { fetchTableRows };
