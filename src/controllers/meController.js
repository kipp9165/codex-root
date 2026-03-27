"use strict";

const { resolveUser } = require("../services/meService");

async function getMe(req, res, next) {
  try {
    const user = resolveUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized", message: "x-user-id header is required" });
    }
    return res.json({ ok: true, user });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getMe };
