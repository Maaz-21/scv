const express = require("express");
const router = express.Router();
const { handleRazorpayWebhook } = require("../controllers/webhook.controller");

// Razorpay requires the raw body for signature verification.
// We use express.raw() specifically for this route.
router.post("/razorpay", express.raw({ type: "application/json" }), handleRazorpayWebhook);

module.exports = router;
