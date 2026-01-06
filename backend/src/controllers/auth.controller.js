const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");
const generateToken = require("../utils/GenerateToken");

exports.register = async (req, res) => {
  const { name, email, password, roleName } = req.body;

  const role = await Role.findOne({ name: roleName });
  if (!role) return res.status(400).json({ message: "Invalid role" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({
    name,
    email,
    role: role._id,
    passwordHash: await bcrypt.hash(password, 10)
  });

  res.json({
    message: "User registered",
    token: generateToken({ ...user.toObject(), roleName: role.name, role })
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).populate("role");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });
  console.log(user);
  res.json({
    message: "Login successful",
    token: generateToken({ ...user.toObject(), roleName: user.role.name })
  });
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
