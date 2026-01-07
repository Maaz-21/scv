const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/ValidateRole");
const { browseListings, placeOrder, myOrders } = require("../controllers/buyer/buyer.order.controller");

router.get("/marketplace", browseListings);

router.post(
  "/order/:listingId",
  auth,
  hasRole("buyer"),
  placeOrder
);

router.get(
  "/orders",
  auth,
  hasRole("buyer"),
  myOrders
);

module.exports = router;