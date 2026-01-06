const Order = require("../../models/Order");
const catchAsync = require("../../utils/catchAsync");


 // Get all orders
exports.getAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.find()
    .populate("listingId", "title category price estimatedWeight location status")
    .populate("buyerId", "name email")
    .sort({ createdAt: -1 });

  res.json({
    message: "Orders retrieved successfully",
    count: orders.length,
    orders
  });
});


 //Update order status (optional - for manual admin updates)
exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "initiated",
    "confirmed",
    "pickup_scheduled",
    "picked",
    "completed"
  ];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    });
  }

  const order = await Order.findById(id)
    .populate("listingId", "title category price estimatedWeight location status")
    .populate("buyerId", "name email");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.status = status;
  await order.save();

  res.json({
    message: "Order status updated successfully",
    order
  });
});
