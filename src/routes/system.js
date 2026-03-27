"use strict";

const express = require("express");
const router = express.Router();
const { ping } = require("../controllers/systemController");

router.get("/listener/ping", ping);

module.exports = router;
