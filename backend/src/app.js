const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const sellerRoutes = require("./routes/seller.routes");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(errorHandler);

module.exports = app;
