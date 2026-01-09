const Order = require("../../models/Order");
const Listing = require("../../models/Listing");
const catchAsync = require("../../utils/catchAsync");

exports.getSellerOrders = catchAsync(async (req, res) => {
  // Find all listings by this seller
  const sellerListings = await Listing.find({ sellerId: req.user.id }).select("_id");
  const listingIds = sellerListings.map(l => l._id);

  // Find orders for these listings
  const orders = await Order.find({ listingId: { $in: listingIds } })
    .populate("listingId", "title category price")
    .populate("buyerId", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders
  });
});
