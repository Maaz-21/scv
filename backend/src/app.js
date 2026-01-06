const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
