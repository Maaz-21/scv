const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Listing = require("../models/Listing");
const catchAsync = require("../utils/catchAsync");

/**
 * Create Razorpay order for a listing
 */
exports.createRazorpayOrder = catchAsync(async (req, res) => {
  const { listingId } = req.body;
  const buyerId = req.user.id;

  // Fetch the listing to get the price
  const listing = await Listing.findById(listingId);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found"
    });
  }

  if (!["live", "inspection_passed"].includes(listing.status)) {
    return res.status(400).json({
      success: false,
      message: "Listing is not available for purchase"
    });
  }

  if (listing.sellerId.toString() === buyerId) {
    return res.status(400).json({
      success: false,
      message: "Cannot buy your own listing"
    });
  }

  // Convert price to paise (Razorpay requires amount in smallest currency unit)
  const amountInPaise = Math.round(listing.price * 100);

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `order_${Date.now()}`,
    notes: {
      listingId: listingId,
      buyerId: buyerId,
      listingTitle: listing.title
    }
  });

  res.status(200).json({
    success: true,
    data: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      listing: {
        id: listing._id,
        title: listing.title,
        price: listing.price,
        image: listing.images[0]
      }
    }
  });
});

/**
 * Verify Razorpay payment signature and create order in database
 */
exports.verifyPayment = catchAsync(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    listingId
  } = req.body;

  const buyerId = req.user.id;

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature"
    });
  }

  // Fetch listing details
  const listing = await Listing.findById(listingId);

  if (!listing) {
    return res.status(404).json({
      success: false,
      message: "Listing not found"
    });
  }

  // Create order in database
  const order = await Order.create({
    listingId,
    buyerId,
    amount: listing.price,
    status: "confirmed",
    paymentId: razorpay_payment_id,
    paymentOrderId: razorpay_order_id,
    paymentSignature: razorpay_signature
  });

  // Update listing status to sold
  listing.status = "sold";
  await listing.save();

  res.status(201).json({
    success: true,
    message: "Payment verified and order created successfully",
    data: order
  });
});

/**
 * Get Razorpay key for frontend
 */
exports.getRazorpayKey = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID
  });
});
