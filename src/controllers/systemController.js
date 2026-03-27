"use strict";

const { pingListener } = require("../services/systemService");

async function ping(req, res, next) {
  try {
    const status = await pingListener();
    return res.json({ ok: true, ...status });
  } catch (err) {
    return next(err);
  }
}

module.exports = { ping };
