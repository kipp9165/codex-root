const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    capabilityMap: {},
    timestamp: new Date().toISOString()
  });
});

router.get("/:mapId", (req, res) => {
  res.json({
    mapId: req.params.mapId,
    capabilities: [],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
