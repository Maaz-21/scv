const User = require("../../models/User");
const Role = require("../../models/Role");
const catchAsync = require("../../utils/catchAsync");
const auditLogger = require("../../middleware/auditLogger");

exports.getPendingSellers = catchAsync(async (req, res) => {
  const sellerRole = await Role.findOne({ name: "seller" });
  if (!sellerRole) {
    return res.status(500).json({ message: "Seller role not found" });
  }

  const sellers = await User.find({
    role: sellerRole._id,
    status: "pending"
  }).select("-passwordHash");

  res.json({ count: sellers.length, sellers });
});

exports.approveSeller = catchAsync(async (req, res) => {
  const { id } = req.params;
  const seller = await User.findById(id);

  if (!seller) return res.status(404).json({ message: "Seller not found" });
  
  // 'active' is the status used in SellItemForm check
  seller.status = "active"; 
  await seller.save();

  await auditLogger(req.user.id, "APPROVE_SELLER", "User", seller._id, `Seller ${seller.name} approved`);

  res.json({ message: "Seller approved", seller });
});

exports.rejectSeller = catchAsync(async (req, res) => {
  const { id } = req.params;
  const seller = await User.findById(id);

  if (!seller) return res.status(404).json({ message: "Seller not found" });
  
  seller.status = "rejected";
  await seller.save();

  await auditLogger(req.user.id, "REJECT_SELLER", "User", seller._id, `Seller ${seller.name} rejected`);

  res.json({ message: "Seller rejected", seller });
});
