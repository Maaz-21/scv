//createListing()
//getMyListings()
// Create scrap listing
// View status
const Listing = require("../../models/Listing");
const Category = require("../../models/Category");
const catchAsync = require("../../utils/catchAsync");
const auditLogger = require("../../middleware/auditLogger");

exports.createListing = catchAsync(async (req, res) => {
  const { title, category, description, estimatedWeight, price, location } = req.body;

  if (!req.files || req.files.length < 4)
    return res.status(400).json({ message: "Minimum 4 images required" });

  const listing = await Listing.create({
    sellerId: req.user.id,
    title,
    category,
    description,
    estimatedWeight,
    price,
    images: req.files.map(f => f.path),
    location,
    status: "submitted"
  });

  auditLogger(req.user.id, "CREATE_LISTING", "Listing", listing._id);

  res.json(listing);
});

exports.getMyListings = catchAsync(async (req, res) => {
  const listings = await Listing.find({ sellerId: req.user.id });
  res.json(listings);
});

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({
    success: true,
    data: categories
  });
});
