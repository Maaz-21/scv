const router = require("express").Router();
const { createListing, getMyListings, getCategories } = require("../controllers/seller/seller.listing.controller");
const { auth } = require("../middleware/auth");
const { hasRole } = require("../middleware/ValidateRole");
const upload = require("../middleware/upload");
router.post(
  "/listing",
  auth,
  hasRole("seller"),
  upload.array("images", 6),
  createListing
);

router.get(
  "/listings",
  auth,
  hasRole("seller"),
  getMyListings
);

router.get(
  "/categories",
  auth,
  getCategories
);

module.exports = router;