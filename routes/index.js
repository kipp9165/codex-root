const express = require("express");
const radarRouter = require("./radar");
const billingRouter = require("./billing");
const healthRouter = require("./health");
const webhooksRouter = require("./webhooks");
const { getVersionInfo } = require("../utils/version");

const router = express.Router();

// Root route
router.get("/", (req, res) => {
  res.status(200).send("Codex Root v1.1 is running");
});

// Health + version
router.use("/health", healthRouter);
router.get("/version", (req, res) => {
  res.status(200).json(getVersionInfo());
});

// Core radar routes
router.use("/radar", radarRouter);

// Backwards-compatible root POST -> /radar
router.post("/", (req, res, next) => {
  req.url = "/"; // delegate to radarRouter POST "/"
  radarRouter.handle(req, res, next);
});

// Billing routes
router.use("/billing", billingRouter);

// Webhooks
router.use("/webhooks", webhooksRouter);

module.exports = router;
