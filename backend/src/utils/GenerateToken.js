const jwt = require("jsonwebtoken");

module.exports = (user) =>
  jwt.sign(
    {
      id: user._id,
      roleId: user.role._id || user.role,
      roleName: user.role.name || user.roleName,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
