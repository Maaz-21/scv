const Order = require("../../models/Order");
const Listing = require("../../models/Listing");
const Category = require("../../models/Category");
const auditLogger = require("../../middleware/auditLogger");
const catchAsync = require("../../utils/catchAsync");

exports.browseListings = catchAsync(async (req, res) => {
  const { preview } = req.query;

  if (preview === "true") {
    // Return only limited fields for homepage preview
    const listings = await Listing.find({ status: { $in: ["live", "inspection_passed"] } })
      .select("title category price images _id createdAt")
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  }

  const listings = await Listing.find({ status: { $in: ["live", "inspection_passed"] } })
    .populate("category", "name")
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

exports.getListingDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate("sellerId", "name email")
    .populate("category", "name");

  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found" });
  }

  res.status(200).json({
    success: true,
    data: listing
  });
});

exports.placeOrder = catchAsync(async (req, res) => {
  const { listingId } = req.params;
  const buyerId = req.user.id;

  const listing = await Listing.findById(listingId);

  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found" });
  }

  // Allow 'live' or 'inspection_passed' listings to be bought
  if (!["live", "inspection_passed"].includes(listing.status)) {
    return res.status(400).json({ success: false, message: "Listing is not available for purchase" });
  }

  if (listing.sellerId.toString() === buyerId) {
    return res.status(400).json({ success: false, message: "Cannot buy your own listing" });
  }

  const order = await Order.create({
    listingId,
    buyerId,
    amount: listing.price,
    status: "initiated"
  });

  // REMOVED: listing.status = "sold";
  // await listing.save();

  await auditLogger(buyerId, "ORDER_CREATED", "Order", order._id, `Order created for listing ${listing.title}`);

  res.status(201).json({
    success: true,
    data: order
  });
});

exports.myOrders = catchAsync(async (req, res) => {
  const orders = await Order.find({ buyerId: req.user.id }).populate("listingId");

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Category.find({});
  res.status(200).json({
    success: true,
    data: categories
  });
}); 