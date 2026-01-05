const mongoose = require("mongoose");

const pickupSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    scheduledDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["scheduled", "in_transit", "delivered"],
      default: "scheduled"
    },
    proofPhoto: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", pickupSchema);
