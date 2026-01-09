const Order = require("../models/Order");
const User = require("../models/User");
const Listing = require("../models/Listing");

const seedOrders = async () => {
  const buyerA = await User.findOne({ email: "buyer.a@test.com" });
  const buyerB = await User.findOne({ email: "buyer.b@test.com" });
  
  // Fetch specific listings created for these orders
  // L8 for Initiated
  const l8 = await Listing.findOne({ title: "L8 - Sold Aluminum (For Initiated)" });
  // L7 for Pickup Scheduled
  const l7 = await Listing.findOne({ title: "L7 - Sold Copper (For Pickup)" });
  // L6 for Completed
  const l6 = await Listing.findOne({ title: "L6 - Sold Scrap Metal (For History)" });

  if (!buyerA || !buyerB || !l8 || !l7 || !l6) {
    console.error("Missing dependencies for Orders. Check Users and Listings.");
    return;
  }

  const orders = [
    {
      listingId: l8._id,
      buyerId: buyerA._id,
      amount: l8.price,
      status: "initiated",
      paymentStatus: "pending"
    },
    {
      listingId: l7._id,
      buyerId: buyerA._id,
      amount: l7.price,
      status: "pickup_scheduled",
      paymentStatus: "paid"
    },
    {
      listingId: l6._id,
      buyerId: buyerB._id,
      amount: l6.price,
      status: "completed",
      paymentStatus: "paid"
    }
  ];

  for (const order of orders) {
    // Check if order exists for this listing to avoid duplicates
    const existing = await Order.findOne({ listingId: order.listingId });
    if (!existing) {
      await Order.create(order);
      console.log(`Order created for Listing: ${order.listingId}`);
    } else {
      console.log(`Order exists for Listing: ${order.listingId}`);
    }
  }
};

module.exports = seedOrders;
