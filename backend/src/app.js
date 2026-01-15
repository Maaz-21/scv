const express = require("express");
const cors = require("cors");
const path= require("path");
const authRoutes = require("./routes/auth.routes");
const sellerRoutes = require("./routes/seller.routes");
const adminRoutes = require("./routes/admin.routes");
const buyerRoutes = require("./routes/buyer.routes");
const pickupRoutes = require("./routes/pickup.routes");
const webhookRoutes = require("./routes/webhook.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());

// Webhooks must be mounted BEFORE express.json() because they need raw body
app.use("/api/webhooks", webhookRoutes);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/pickup", pickupRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
