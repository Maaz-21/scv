const crypto = require("crypto");
const { razorpay } = require("../../config/razorpay");
const Order = require("../../models/Order");
const Listing = require("../../models/Listing");
const catchAsync = require("../../utils/catchAsync");
const auditLogger = require("../../middleware/auditLogger");

exports.createOrder = catchAsync(async (req, res) => {
  const { listingId } = req.body;
  const buyerId = req.user.id;

  if (!listingId) {
    return res.status(400).json({ success: false, message: "Listing ID is required" });
  }

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

  // Create Order in DB (Initiated)
  const order = await Order.create({
    listingId,
    buyerId,
    amount: listing.price,
    status: "initiated",
    paymentStatus: "pending"
  });

  // Create Razorpay Order
  const options = {
    amount: listing.price * 100, // INR -> paise
    currency: "INR",
    receipt: `order_${order._id}`,
    payment_capture: 1,
    notes: {
      order_id: order._id.toString()
    }
  };

  let razorpayOrder; 
  try {
      razorpayOrder = await razorpay.orders.create(options);
  } catch (error) {
      // If RP fails, maybe delete the DB order?
      await Order.findByIdAndDelete(order._id);
      throw error;
  }

  await auditLogger(buyerId, "ORDER_INITIATED", "Order", order._id, `Order initiated for listing ${listing.title}`);

  res.status(201).json({
    success: true,
    order,
    razorpayOrder
  });
});

exports.verifyPayment = catchAsync(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    const order = await Order.findById(orderId);
    
    if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update Order
    order.status = "confirmed";
    order.paymentStatus = "paid";
    // order.paymentId = razorpay_payment_id; // Add to schema if needed
    await order.save();

    // Update Listing to Sold
    const listing = await Listing.findById(order.listingId);
    if(listing) {
        listing.status = "sold";
        await listing.save();
    }
    
    await auditLogger(req.user.id, "ORDER_CONFIRMED", "Order", order._id, `Payment verified for order ${order._id}`);

    return res.json({ success: true });
  }

  res.status(400).json({ success: false, message: "Invalid signature" });
});
