module.exports.hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleName) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.roleName)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient role." });
    }

    next();
  };
};  
