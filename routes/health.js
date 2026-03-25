const express = require("express");
const { handleHealthCheck } = require("../controllers/healthController");

const router = express.Router();

// GET /health
router.get("/", handleHealthCheck);

module.exports = router;
