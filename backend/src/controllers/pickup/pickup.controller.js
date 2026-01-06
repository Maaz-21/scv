const Pickup = require("../../models/Pickup");
const Order = require("../../models/Order");
const auditLogger = require("../../middleware/auditLogger");
const catchAsync = require("../../utils/catchAsync");

exports.schedulePickup = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { scheduledDate } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const pickup = await Pickup.create({
    orderId,
    scheduledDate,
    status: "scheduled"
  });

  order.status = "pickup_scheduled";
  await order.save();

  await auditLogger(req.user.id, "SCHEDULE_PICKUP", "Pickup", pickup._id, `Pickup scheduled for order ${orderId}`);

  res.status(201).json({
    success: true,
    data: pickup
  });
});

exports.updatePickupStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const pickup = await Pickup.findOne({ orderId });
  if (!pickup) {
    return res.status(404).json({ success: false, message: "Pickup not found for this order" });
  }

  pickup.status = status;
  await pickup.save();

  res.status(200).json({
    success: true,
    data: pickup
  });
});

exports.uploadPickupProof = catchAsync(async (req, res) => {
  const { orderId } = req.params;

  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const pickup = await Pickup.findOne({ orderId });
  if (!pickup) {
    return res.status(404).json({ success: false, message: "Pickup not found for this order" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  pickup.proofPhoto = req.file.path;
  pickup.status = "delivered";
  await pickup.save();

  order.status = "completed";
  await order.save();

  await auditLogger(req.user.id, "PICKUP_COMPLETED", "Pickup", pickup._id, `Proof uploaded for order ${orderId}`);

  res.status(200).json({
    success: true,
    data: pickup
  });
});