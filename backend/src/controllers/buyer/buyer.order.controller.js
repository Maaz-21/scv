const Order = require("../../models/Order");
const Listing = require("../../models/Listing");
const auditLogger = require("../../middleware/auditLogger");
const catchAsync = require("../../utils/catchAsync");

exports.browseListings = catchAsync(async (req, res) => {
  const listings = await Listing.find({ status: "approved" });
  
  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

exports.placeOrder = catchAsync(async (req, res) => {
  const { listingId } = req.params;
  const buyerId = req.user.id;

  const listing = await Listing.findById(listingId);

  if (!listing) {
    return res.status(404).json({ success: false, message: "Listing not found" });
  }

  if (listing.status !== "approved") {
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

  listing.status = "sold";
  await listing.save();

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