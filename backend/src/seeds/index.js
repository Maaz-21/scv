require("dotenv").config();
const mongoose = require("mongoose");

const seedRoles = require("./seedRoles");
const seedCategories = require("./seedCategories");
const seedUsers = require("./seedUsers");
const seedListings = require("./seedListings");
const seedOrders = require("./seedOrders");
const seedPickups = require("./seedPickups");

const runSeeds = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected for Seeding...");

    console.log("🟢 1. Seeding Roles...");
    await seedRoles();

    console.log("🟢 2. Seeding Categories...");
    await seedCategories();

    console.log("🟢 3. Seeding Users...");
    await seedUsers();

    console.log("🟢 4. Seeding Listings...");
    await seedListings();

    console.log("🟢 5. Seeding Orders...");
    await seedOrders();

    console.log("🟢 6. Seeding Pickups...");
    await seedPickups();

    console.log("✅ All seeds completed successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

runSeeds();
