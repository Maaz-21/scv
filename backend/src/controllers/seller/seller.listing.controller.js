//createListing()
//getMyListings()
// Create scrap listing
// View status
const Listing = require("../../models/Listing");
const Category = require("../../models/Category");
const catchAsync = require("../../utils/catchAsync");
const auditLogger = require("../../middleware/auditLogger");
const cloudinary = require("../../config/cloudinary");

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: "scavengerhunt/listings" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(fileBuffer);
  });
};

exports.createListing = catchAsync(async (req, res) => {
  const { title, category, description, estimatedWeight, price, location } = req.body;

  if (!req.files || req.files.length < 4)
    return res.status(400).json({ message: "Minimum 4 images required" });
  
  const imageUploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer)
    );

  const imageUrls = await Promise.all(imageUploadPromises);

  const listing = await Listing.create({
    sellerId: req.user.id,
    title,
    category,
    description,
    estimatedWeight,
    price,
    images: imageUrls,
    location,
    status: "submitted"
  });

  await auditLogger(req.user.id, "CREATE_LISTING", "Listing", listing._id);

  res.json(listing);
});

exports.uploadToCloudinary = uploadToCloudinary;

exports.getMyListings = catchAsync(async (req, res) => {
  const listings = await Listing.find({ sellerId: req.user.id })
    .populate("category", "name")
    .sort({ createdAt: -1 });
  res.json(listings);
});

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({
    success: true,
    data: categories
  });
});
