"use strict";

const express = require("express");
const router = express.Router();
const { loadMap, loadMapForTier } = require("../controllers/capabilityMapController");

router.get("/load", loadMap);
router.get("/load/:tier", loadMapForTier);

module.exports = router;
