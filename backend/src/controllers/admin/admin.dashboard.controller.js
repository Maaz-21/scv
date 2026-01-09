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
  const totalSellers = sellerRole ? await User.countDocuments({ role: sellerRole._id }) : 0;
  
  // Count 'submitted' as pending listings for admin review (since seeds use 'submitted')
  const pendingListings = await Listing.countDocuments({ status: "submitted" });
  const liveItems = await Listing.countDocuments({ status: { $in: ["live", "inspection_passed"] } });
  const totalOrders = await Order.countDocuments();

  res.json({
    totalSellers,
    pendingListings,
    liveItems,
    totalOrders
  });
});
