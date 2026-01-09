const Listing = require("../models/Listing");
const User = require("../models/User");
const Category = require("../models/Category");

const seedListings = async () => {
  const seller = await User.findOne({ email: "seller.approved@test.com" });
  if (!seller) {
    console.error("Seller Approved not found. Run seedUsers first.");
    return;
  }

  const catIron = await Category.findOne({ name: "Iron" });
  const catCopper = await Category.findOne({ name: "Copper" });
  const catAlum = await Category.findOne({ name: "Aluminum" });
  const catEwaste = await Category.findOne({ name: "E-Waste" });

  if (!catIron || !catCopper) {
    console.error("Categories not found. Run seedCategories first.");
    return;
  }

  const listings = [
    {
      title: "L1 - Rusty Iron Pipes (Submitted)",
      description: "A pile of old rusty iron pipes from a renovation site.",
      category: catIron._id,
      estimatedWeight: 50,
      price: 100,
      images: ["https://placehold.co/600x400/png?text=Rusty+Pipes"],
      location: "123 Industrial Rd",
      status: "submitted",
      sellerId: seller._id
    },
    {
      title: "L2 - Copper Wire Bundle (Admin Approved)",
      description: "Stripped copper wires, high quality.",
      category: catCopper._id,
      estimatedWeight: 20,
      price: 300,
      images: ["https://placehold.co/600x400/png?text=Copper+Wire"],
      location: "456 Commerce St",
      status: "admin_approved",
      sellerId: seller._id
    },
    {
      title: "L3 - Aluminum Sheets (Insp Passed)",
      description: "Clean aluminum sheets, ready for recycling.",
      category: catAlum._id,
      estimatedWeight: 100,
      price: 500,
      images: ["https://placehold.co/600x400/png?text=Aluminum+Sheets"],
      location: "789 Factory Ln",
      status: "inspection_passed", // This allows it to be on the marketplace
      sellerId: seller._id
    },
    {
      title: "L4 - Mixed E-Waste (Insp Failed)",
      description: "Old computer parts, mixed quality.",
      category: catEwaste._id,
      estimatedWeight: 10,
      price: 50,
      images: ["https://placehold.co/600x400/png?text=E-Waste"],
      location: "321 Tech Blvd",
      status: "inspection_failed",
      rejectionReason: "Contains hazardous non-recyclable materials.",
      sellerId: seller._id
    },
    {
      title: "L5 - Car Engine Block (Live)",
      description: "Cast iron engine block, oil drained.",
      category: catIron._id,
      estimatedWeight: 150,
      price: 200,
      images: ["https://placehold.co/600x400/png?text=Engine+Block"],
      location: "654 Auto Way",
      status: "live", // Assuming live means inspection_passed
      sellerId: seller._id
    },
    {
      title: "L6 - Sold Scrap Metal (For History)",
      description: "Batch of mixed scrap metal already processed.",
      category: catIron._id,
      estimatedWeight: 500,
      price: 800,
      images: ["https://placehold.co/600x400/png?text=Sold+Metal"],
      location: "987 Warehouse Dr",
      status: "sold",
      sellerId: seller._id
    },
    // Adding extra listings to support multiple orders in seedOrders
    {
        title: "L7 - Sold Copper (For Pickup)",
        description: "Copper pipes awaiting pickup.",
        category: catCopper._id,
        estimatedWeight: 30,
        price: 450,
        images: ["https://placehold.co/600x400/png?text=Sold+Copper"],
        location: "111 Pickup Ln",
        status: "sold",
        sellerId: seller._id
    },
    {
        title: "L8 - Sold Aluminum (For Initiated)",
        description: "Aluminum batch just ordered.",
        category: catAlum._id,
        estimatedWeight: 80,
        price: 400,
        images: ["https://placehold.co/600x400/png?text=Sold+Aluminum"],
        location: "222 New Order Rd",
        status: "sold",
        sellerId: seller._id
    }
  ];

  for (const item of listings) {
    const existing = await Listing.findOne({ title: item.title });
    if (!existing) {
      await Listing.create(item);
      console.log(`Listing created: ${item.title}`);
    } else {
      console.log(`Listing exists: ${item.title}`);
    }
  }
};

module.exports = seedListings;
