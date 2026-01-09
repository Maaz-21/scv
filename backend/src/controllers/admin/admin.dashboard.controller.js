const Listing = require("../../models/Listing");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Role = require("../../models/Role");
const catchAsync = require("../../utils/catchAsync");

/**
 * Get statistics summary for admin dashboard
 */
exports.getStatsSummary = catchAsync(async (req, res) => {
  const sellerRole = await Role.findOne({ name: "seller" });
  if (!sellerRole) {
    return res.status(500).json({ message: "Seller role not found" });
  }

  // Execute all queries in parallel for efficiency
  const [
    totalSellers,
    pendingSellers,
    pendingListings,
    liveListings,
    activeOrders,
    recentOrders,
    recentListings,
    recentSellers
  ] = await Promise.all([
    User.countDocuments({ role: sellerRole._id }),
    User.countDocuments({ role: sellerRole._id, status: "pending" }),
    Listing.countDocuments({ status: "submitted" }),
    Listing.countDocuments({ status: { $in: ["live", "inspection_passed"] } }),
    Order.countDocuments({ status: { $in: ["initiated", "confirmed", "pickup_scheduled"] } }),
    
    // Recent Orders
    Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("buyerId", "name email")
      .populate("listingId", "title price"),

    // Recent Listings
    Listing.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("sellerId", "name companyName"),

    // Recent Sellers
    User.find({ role: sellerRole._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email companyName status createdAt")
  ]);

  res.json({
    stats: {
      totalSellers,
      pendingSellers,
      pendingListings,
      liveListings,
      activeOrders
    },
    recent: {
      orders: recentOrders,
      listings: recentListings,
      sellers: recentSellers
    }
  });
});
