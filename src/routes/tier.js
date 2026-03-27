"use strict";

const express = require("express");
const router = express.Router();
const { getTierResolution } = require("../controllers/tierController");

router.get("/resolve", getTierResolution);
router.post("/resolve", getTierResolution);

module.exports = router;
