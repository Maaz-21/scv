const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/ValidateRole");
const {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey
} = require("../controllers/payment.controller");

// Get Razorpay key (public endpoint)
router.get("/razorpay-key", getRazorpayKey);

// Create Razorpay order (buyer only)
router.post(
  "/create-order",
  auth,
  hasRole("buyer"),
  createRazorpayOrder
);

// Verify payment and create order (buyer only)
router.post(
  "/verify",
  auth,
  hasRole("buyer"),
  verifyPayment
);

module.exports = router;
