const router = require("express").Router();
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/ValidateRole");
const upload = require("../middleware/upload");
const { schedulePickup, updatePickupStatus ,uploadPickupProof } = require("../controllers/pickup/pickup.controller");

router.post(
  "/:orderId/schedule",
  auth,
  hasRole("admin"),
  schedulePickup
);

router.put(
  "/:orderId/status",
  auth,
  hasRole("admin"),
  updatePickupStatus
);
router.post(
  "/:orderId/proof",
  auth,
  hasRole("admin"),
  upload.single("proof"),
  uploadPickupProof
);

module.exports = router;