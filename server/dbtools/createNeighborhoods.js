// dbtools/loadNeighborhoods.js
const fs = require("fs");
const path = require("path");
const Neighborhood = require("../models/neighborhoodModel");  // Adjust path as needed


async function checkDuplicates() {
    try {
      const allNeighborhoods = await Neighborhood.find({}, 'properties.shemshchun');
      const total = allNeighborhoods.length;

      const seen = new Set();
      const duplicates = new Set();

      for (const doc of allNeighborhoods) {
        const name = doc.properties?.shemshchun;
        if (name) {
          if (seen.has(name)) {
            duplicates.add(name);
          } else {
            seen.add(name);
          }
        }
      }

      console.log(`✅ Total documents: ${total}`);
      if (duplicates.size > 0) {
        console.log("📝 Duplicates:");
        for (const name of duplicates) {
          console.log(`- ${name}`);
        }
      } else {
        console.log("🎉 No duplicates found.");
      }

    } catch (err) {
      console.error("❌ Error:", err);
    }
  }

// Assumes DB is already connected
async function loadNeighborhoods() {
  try {
    // Delete existing neighborhoods
    await Neighborhood.deleteMany({});
    console.log("Existing neighborhoods deleted.");

    // Load GeoJSON data
    const filePath = path.join(__dirname, "../data/telaviv-neighbourhoods.json");  // Adjust path as needed
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Insert neighborhoods
    const inserted = await Neighborhood.insertMany(data.features);
    console.log(`${inserted.length} neighborhoods inserted.`);

    // ✅ Check for duplicates after insertion
    await checkDuplicates();

  } catch (err) {
    console.error("Error loading neighborhoods:", err);
    throw err;
  }
}

module.exports = { loadNeighborhoods };
