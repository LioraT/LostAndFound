const express = require('express');
const Policestation = require('../models/policestation'); // Import the PoliceStation model
const verifyToken = require("../middleware/authMiddleware");
const router = express.Router();
const mongoose = require('mongoose');   



// Route to get all police stations
router.get('/all', verifyToken(), async (req, res) => {
  try {
    const stations = await Policestation.find({});
    console.log(`Retrieved ${stations.length} police stations`);
    res.json(stations);
  } catch (err) {
    console.error('Error fetching all police stations:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Route to get nearby police stations based on coordinates
router.get('/nearby', verifyToken(), async (req, res) => {
  const { lat, lon, maxDistance = 5000 } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    console.log(`Searching for police stations near coordinates: [${lon}, ${lat}] within ${maxDistance}m`);
    
    const nearbyStations = await Policestation.find({
      geometry: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [ parseFloat(lon),parseFloat(lat)], // [longitude, latitude]
          },
          $maxDistance: parseInt(maxDistance), // Search within a given distance (default 5000 meters)
        }
      }
    }).limit(5);
    console.log("Querying at:", [lon, lat]);

    console.log(`Found ${nearbyStations.length} nearby police stations`);
    res.json(nearbyStations);
  } catch (err) {
    console.error('Error fetching nearby police stations:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;
