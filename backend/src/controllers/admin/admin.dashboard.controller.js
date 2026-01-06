const Listing = require("../../models/Listing");
const Order = require("../../models/Order");
const User = require("../../models/User");
const catchAsync = require("../../utils/catchAsync");

/**
 * Get statistics summary for admin dashboard
 */
exports.getStatsSummary = catchAsync(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalListings = await Listing.countDocuments();
  const pendingListings = await Listing.countDocuments({ status: "pending" });
  const approvedListings = await Listing.countDocuments({ status: "approved" });
  const totalOrders = await Order.countDocuments();
  const completedOrders = await Order.countDocuments({ status: "completed" });

  res.json({
    totalUsers,
    totalListings,
    pendingListings,
    approvedListings,
    totalOrders,
    completedOrders
  });
});
