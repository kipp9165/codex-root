"use strict";

const { recordEvent } = require("../services/eventsService");

async function logEvent(req, res, next) {
  try {
    const { type, userId, payload, source } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Bad Request", message: "type is required" });
    }

    const result = await recordEvent({ type, userId, payload, source });
    return res.status(201).json({ ok: true, ...result });
  } catch (err) {
    return next(err);
  }
}

module.exports = { logEvent };
