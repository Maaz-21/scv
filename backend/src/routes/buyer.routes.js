const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/ValidateRole");
const { browseListings, placeOrder, myOrders, getListingDetails } = require("../controllers/buyer/buyer.order.controller");

router.get("/marketplace", browseListings);
router.get("/listing/:id", getListingDetails);

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