const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Neighborhood = require("./models/neighborhoodModel");

require("dotenv").config();

const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

async function loadGeoJSON() {
  const filePath = path.join(__dirname, "data", "telaviv-neighbourhoods.json");
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const inserted = await Neighborhood.insertMany(data.features);
  console.log(`${inserted.length} neighborhoods inserted.`);
  process.exit();
}

loadGeoJSON().catch(err => {
  console.error("Error loading GeoJSON:", err);
  process.exit(1);
});
