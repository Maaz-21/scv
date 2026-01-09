const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/ValidateRole");
const {
  getPendingListings,
  approveListing,
  rejectListing,
  getInspections,
  processInspection
} = require("../controllers/admin/admin.listing.controller");
const {
  getAllOrders,
  updateOrderStatus
} = require("../controllers/admin/admin.order.controller");
const {
  getStatsSummary
} = require("../controllers/admin/admin.dashboard.controller");

router.get("/dashboard", auth, hasRole("admin"), getStatsSummary);

router.get("/listings/pending", auth, hasRole("admin"), getPendingListings);

router.post("/listings/:id/approve", auth, hasRole("admin"), approveListing);

router.post("/listings/:id/reject", auth, hasRole("admin"), rejectListing);

router.get("/listings/inspections", auth, hasRole("admin"), getInspections);

router.post("/listings/:id/inspection", auth, hasRole("admin"), processInspection);

router.get("/orders", auth, hasRole("admin"), getAllOrders);

router.patch("/orders/:id/status", auth, hasRole("admin"), updateOrderStatus);

module.exports = router;
