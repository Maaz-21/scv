const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/ValidateRole");
const { browseListings, placeOrder, myOrders, getListingDetails, getCategories } = require("../controllers/buyer/buyer.order.controller");
const { createOrder, verifyPayment } = require("../controllers/buyer/buyer.payment.controller");

router.get("/marketplace", browseListings);
router.get("/categories", getCategories);
router.get("/listing/:id", getListingDetails);

router.post(
  "/order/:listingId",
  auth,
  hasRole("buyer"),
  placeOrder
);

router.post(
  "/payments/create-order",
  auth,
  hasRole("buyer"),
  createOrder
);

router.post(
  "/payments/verify",
  auth,
  hasRole("buyer"),
  verifyPayment
);

router.get(
  "/orders",
  auth,
  hasRole("buyer"),
  myOrders
);

module.exports = router;