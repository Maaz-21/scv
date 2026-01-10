const express = require("express");
const cors = require("cors");
const path= require("path");
const authRoutes = require("./routes/auth.routes");
const sellerRoutes = require("./routes/seller.routes");
const adminRoutes = require("./routes/admin.routes");
const buyerRoutes = require("./routes/buyer.routes");
const pickupRoutes = require("./routes/pickup.routes");
const uploadRoutes = require("./routes/upload.routes");
const paymentRoutes = require("./routes/payment.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/pickup", pickupRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);

app.use(errorHandler);

module.exports = app;
