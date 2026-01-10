const router = require("express").Router();
const { auth } = require("../middleware/auth");
const upload = require("../middleware/upload");
const { uploadImages, uploadSingleImage } = require("../controllers/upload.controller");

// Upload multiple images (for listings)
router.post(
  "/images",
  auth,
  upload.array("images", 10), // Max 10 images
  uploadImages
);

// Upload single image
router.post(
  "/image",
  auth,
  upload.single("image"),
  uploadSingleImage
);

module.exports = router;
