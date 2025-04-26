const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');  // Direct mongoose (no destructure)
const collectionName = 'policestations';
const file = 'telaviv-policestations.geojson';

// Assumes DB is already connected
async function loadPoliceStations() {
  try {
    const filePath = path.join(__dirname, '../data', file);  // Adjust path
    const data = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(data);

    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);

    await collection.deleteMany({});
    console.log(`Existing ${collectionName} deleted.`);

    const transformedFeatures = geojson.features
      .filter(f => f.geometry?.type === "Point")
      .map(feature => ({
        osm_id: feature.properties['@id'] || feature.id,
        amenity: 'police',
        geometry: feature.geometry,
        properties: feature.properties
      }));

    await collection.insertMany(transformedFeatures);
    await collection.createIndex({ 'geometry': '2dsphere' });

    console.log(`✅ ${collectionName} imported successfully.`);
    console.log(`Total stations imported: ${transformedFeatures.length}`);
  } catch (err) {
    console.error(`❌ Error importing ${collectionName}:`, err);
    throw err;
  }
}

module.exports = { loadPoliceStations };
