"use strict";

const express = require("express");
const router = express.Router();
const { logEvent } = require("../controllers/eventsController");

router.post("/log", logEvent);

module.exports = router;
