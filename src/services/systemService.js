"use strict";

const axios = require("axios");

const LISTENER_URL = process.env.SYSTEM_LISTENER_URL || null;

/**
 * Ping the system listener (if configured) and return its status.
 */
async function pingListener() {
  const status = {
    codexRoot: {
      version: "0.5.0",
      status: "online",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    listener: null,
  };

  if (LISTENER_URL) {
    try {
      const { data } = await axios.get(`${LISTENER_URL}/ping`, { timeout: 4000 });
      status.listener = { connected: true, response: data };
    } catch (err) {
      status.listener = { connected: false, error: err.message };
    }
  } else {
    status.listener = { connected: false, error: "SYSTEM_LISTENER_URL not configured" };
  }

  return status;
}

module.exports = { pingListener };
