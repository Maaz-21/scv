const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    description: {
      type: String,
      required: true
    },
    estimatedWeight: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    images: [String],
    location: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["submitted", "admin_approved", "inspection_passed", 
             "inspection_failed", "live", "sold", "rejected"],
      default: "submitted"
    },
    rejectionReason: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);
