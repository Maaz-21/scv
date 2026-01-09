const Pickup = require("../models/Pickup");
const Order = require("../models/Order");

const seedPickups = async () => {
    // Find orders that need pickups (pickup_scheduled or completed)
    // We expect the orders we created in seedOrders to be here.
    
    // 1. Find the 'pickup_scheduled' order
    const scheduledOrder = await Order.findOne({ status: "pickup_scheduled" });
    // 2. Find the 'completed' order
    const completedOrder = await Order.findOne({ status: "completed" });

    const pickups = [];

    if (scheduledOrder) {
        pickups.push({
            orderId: scheduledOrder._id,
            scheduledDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Tomorrow
            status: "scheduled",
            proofPhoto: null
        });
    } else {
        console.log("No pickup_scheduled order found to creation pickup for.");
    }

    if (completedOrder) {
        pickups.push({
            orderId: completedOrder._id,
            scheduledDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // Yesterday
            status: "delivered",
            proofPhoto: "https://placehold.co/600x400/png?text=Delivery+Proof"
        });
    } else {
        console.log("No completed order found to creation pickup for.");
    }

    for (const p of pickups) {
        const existing = await Pickup.findOne({ orderId: p.orderId });
        if (!existing) {
            await Pickup.create(p);
            console.log(`Pickup created for Order: ${p.orderId} with status ${p.status}`);
        } else {
            console.log(`Pickup exists for Order: ${p.orderId}`);
        }
    }
};

module.exports = seedPickups;
