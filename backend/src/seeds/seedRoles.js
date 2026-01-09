const Role = require("../models/Role");

const seedRoles = async () => {
  const roles = [
    { 
      name: "admin", 
      description: "Administrator with full access to manage the platform." 
    },
    { 
      name: "seller", 
      description: "User who can list and sell scrap materials." 
    },
    { 
      name: "buyer", 
      description: "User who can browse and purchase scrap materials." 
    }
  ];

  for (const role of roles) {
    const existing = await Role.findOne({ name: role.name });
    if (!existing) {
      await Role.create(role);
      console.log(`Role created: ${role.name}`);
    } else {
      console.log(`Role exists: ${role.name}`);
    }
  }
};

module.exports = seedRoles;
