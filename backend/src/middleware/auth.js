const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.hasRole = (roleName) => (req, res, next) => {
  if (req.user.roleName !== roleName)
    return res.status(403).json({ message: `${roleName} required` });

  next();
};
