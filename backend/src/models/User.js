const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: String,

    passwordHash: { type: String, required: true },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true
    },

    companyName: String,

    kycDocs: [String],

    status: {
      type: String,
      enum: ["pending", "approved", "blocked", "rejected", "active"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
