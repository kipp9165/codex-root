const express = require("express");
const {
  handleCheckoutSession,
  handleBillingPortal
} = require("../controllers/billingController");

const router = express.Router();

// POST /billing/checkout
router.post("/checkout", handleCheckoutSession);

// GET /billing/portal
router.get("/portal", handleBillingPortal);

module.exports = router;
