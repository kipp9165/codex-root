"use strict";

const express = require("express");
const router = express.Router();
const { createCheckout, createPortal } = require("../controllers/stripeController");

router.post("/create-checkout-session", createCheckout);
router.post("/create-portal-session", createPortal);

module.exports = router;
