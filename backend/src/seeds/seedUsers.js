const bcrypt = require("bcrypt");
const User = require("../models/User");
const Role = require("../models/Role");

const seedUsers = async () => {
  // Fetch Roles
  const adminRole = await Role.findOne({ name: "admin" });
  const sellerRole = await Role.findOne({ name: "seller" });
  const buyerRole = await Role.findOne({ name: "buyer" });

  if (!adminRole || !sellerRole || !buyerRole) {
    console.error("Roles not found. Run seedRoles first.");
    return;
  }

  const commonPassword = await bcrypt.hash("admin123", 10);

  const users = [
    {
      name: "Admin User",
      email: "admin@test.com",
      passwordHash: commonPassword,
      role: adminRole._id,
      status: "approved",
      phone: "1112223333"
    },
    {
      name: "Seller Pending",
      email: "seller.pending@test.com",
      passwordHash: commonPassword,
      role: sellerRole._id,
      status: "pending",
      companyName: "Pending Scrap Co",
      phone: "2223334444"
    },
    {
      name: "Seller Approved",
      email: "seller.approved@test.com",
      passwordHash: commonPassword,
      role: sellerRole._id,
      status: "approved",
      companyName: "Prime Metals Ltd",
      phone: "3334445555"
    },
    {
      name: "Buyer A",
      email: "buyer.a@test.com",
      passwordHash: commonPassword,
      role: buyerRole._id,
      status: "approved",
      phone: "4445556666"
    },
    {
      name: "Buyer B",
      email: "buyer.b@test.com",
      passwordHash: commonPassword,
      role: buyerRole._id,
      status: "approved",
      phone: "5556667777"
    }
  ];

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      await User.create(user);
      console.log(`User created: ${user.name} (${user.email})`);
    } else {
      console.log(`User exists: ${user.name}`);
    }
  }
};

module.exports = seedUsers;
