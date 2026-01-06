const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/ValidateRole");
const {
  getPendingListings,
  approveListing,
  rejectListing
} = require("../controllers/admin/admin.listing.controller");
const {
  getAllOrders,
  updateOrderStatus
} = require("../controllers/admin/admin.order.controller");

router.get("/listings/pending", auth, hasRole("admin"), getPendingListings);

router.post("/listings/:id/approve", auth, hasRole("admin"), approveListing);

router.post("/listings/:id/reject", auth, hasRole("admin"), rejectListing);

router.get("/orders", auth, hasRole("admin"), getAllOrders);

router.patch("/orders/:id/status", auth, hasRole("admin"), updateOrderStatus);

module.exports = router;
