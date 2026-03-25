const express = require("express");
const { validateRadarInput } = require("../middleware/validateInput");
const { handleRadarRequest } = require("../controllers/radarController");

const router = express.Router();

// POST /radar
router.post("/", validateRadarInput, handleRadarRequest);

module.exports = router;
