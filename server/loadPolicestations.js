const fs = require('fs');
const path = require('path');
const { mongoose } = require('mongoose');
const collectionName = 'policestations';
const file = 'telaviv-policestations.geojson';
require("dotenv").config();

const MONGO_URI = process.env.MONGODB_URI;


async function loadData() {
 
  try {
    // Path to your GeoJSON file
    const filePath = path.join(__dirname,'data', file);

    // Read and parse the GeoJSON file
    const data = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(data);

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);

    // Clear old data from the collection
    await collection.deleteMany({});

    // Transform the features to match our schema
    const transformedFeatures = geojson.features
    .filter(f => f.geometry?.type === "Point")
    .map(feature => ({
      osm_id: feature.properties['@id'] || feature.id,
      amenity: 'police',
      geometry: feature.geometry,
      properties: feature.properties // Keep all properties for reference
    }));

    // Insert each feature into the collection
    await collection.insertMany(transformedFeatures);

    // Create a 2dsphere index so we can do geo queries like $near
    await collection.createIndex({ 'geometry': '2dsphere' });

    console.log(`✅ ${collectionName} imported successfully.`);
    console.log(`Total stations imported: ${transformedFeatures.length}`);
  } catch (err) {
    console.error(`❌ Error importing ${collectionName}:`, err);
  } finally {
    // Close the connection to MongoDB
    await mongoose.connection.close();
  }
}

// Run the script
loadData();
