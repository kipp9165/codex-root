"use strict";

require("dotenv/config");
const axios = require("axios");
const logger = require("../utils/logger");

const BASEROW_API_URL = process.env.BASEROW_API_URL || "https://api.baserow.io";
const BASEROW_TOKEN   = process.env.BASEROW_TOKEN || "";
const TABLE_ID        = process.env.BASEROW_TABLE_ID || "";

if (!BASEROW_TOKEN) {
  logger.warn("baserowClient: BASEROW_TOKEN is not set — API calls will fail.");
}
if (!TABLE_ID) {
  logger.warn("baserowClient: BASEROW_TABLE_ID is not set — polling will be a no-op.");
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
 */
async function fetchTableRows() {
  if (!TABLE_ID) {
    logger.warn("baserowClient.fetchTableRows: TABLE_ID not configured, skipping.");
    return [];
  }
  const response = await client.get(`/database/rows/table/${TABLE_ID}/`, {
    params: { user_field_names: true },
  });
  return response.data.results || [];
}

module.exports = { fetchTableRows };
