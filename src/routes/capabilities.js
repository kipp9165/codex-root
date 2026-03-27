"use strict";

const express = require("express");
const router = express.Router();
const { getCapabilities } = require("../controllers/capabilitiesController");

router.get("/", getCapabilities);

module.exports = router;
