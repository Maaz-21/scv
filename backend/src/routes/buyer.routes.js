const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/role");

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