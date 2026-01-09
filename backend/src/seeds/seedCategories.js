const Category = require("../models/Category");

const seedCategories = async () => {
  const categories = [
    { name: "Iron", description: "Ferrous metals including steel and iron alloys." },
    { name: "Copper", description: "Copper wiring, pipes, and sheets." },
    { name: "Aluminum", description: "Aluminum cans, sheets, and parts." },
    { name: "E-Waste", description: "Electronic waste like circuit boards, phones, and computers." },
    { name: "Auto Parts", description: "Scrap parts from vehicles." }
  ];

  for (const cat of categories) {
    const existing = await Category.findOne({ name: cat.name });
    if (!existing) {
      await Category.create(cat);
      console.log(`Category created: ${cat.name}`);
    } else {
      console.log(`Category exists: ${cat.name}`);
    }
  }
};

module.exports = seedCategories;
