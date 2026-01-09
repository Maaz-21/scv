const catchAsync = require("../utils/catchAsync");

/**
 * Upload multiple images to Cloudinary
 * Returns array of Cloudinary URLs
 */
exports.uploadImages = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded"
    });
  }

  // Extract Cloudinary URLs from uploaded files
  const imageUrls = req.files.map(file => file.path);

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    data: imageUrls
  });
});

/**
 * Upload single image to Cloudinary
 * Returns Cloudinary URL
 */
exports.uploadSingleImage = catchAsync(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded"
    });
  }

  res.status(200).json({
    success: true,
    message: "Image uploaded successfully",
    data: req.file.path
  });
});
