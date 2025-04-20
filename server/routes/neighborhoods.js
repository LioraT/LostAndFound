 const express = require('express');
 const router = express.Router();
 const verifyToken = require("../middleware/authMiddleware");
 const Item = require("../models/item");
 const debug = require('../utils/debug');
 //const adminOnly = require("../middleware/adminOnly");
// const mongoose = require('mongoose');
const Neighborhood = require("../models/neighborhoodModel"); // Adjust path as needed


// Identify neighborhood from coordinates
router.post("/find-by-coordinates",verifyToken(), async (req, res) => {
  const { lng, lat } = req.body;

  if (lng == null || lat == null) {
    return res.status(400).json({ error: "Missing coordinates" });
  }
  try {
    const neighborhood = await Neighborhood.findOne({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
        },
      },
    });

    if (!neighborhood) {
      return res.status(404).json({ error: "Neighborhood not found" });
    }
    const ne_name = debug.hebstr(neighborhood.properties.shemshchun);
    debug.log("neighborhood: ",ne_name);
    return res.json({ shemshchun: neighborhood.properties.shemshchun }); 
  } catch (err) {
    console.error("Error finding neighborhood:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /neighborhoods/by-name/:shemshchun = Get items within neighborhood polygon
router.get('/by-name/:shemshchun', verifyToken(), async (req, res) => {
  const { shemshchun } = req.params;

  try {
    const neighborhood = await Neighborhood.findOne({ "properties.shemshchun": shemshchun });

    if (!neighborhood) {
      return res.status(404).json({ error: "Neighborhood not found" });
    }

    res.json(neighborhood); // this will include geometry
  } catch (err) {
    console.error("Error fetching neighborhood by name:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get items within neighborhood polygon
router.get('/by-neighborhood/:shemshchun', verifyToken(), async (req, res) => {
  const { shemshchun } = req.params;

  try {
    const neighborhood = await Neighborhood.findOne({ "properties.shemshchun": shemshchun });
    if (!neighborhood) return res.status(404).json({ error: "Neighborhood not found" });

    const items = await Item.find({
      location: {
        $geoWithin: {
          $geometry: neighborhood.geometry
        }
      }
    });
    //debug.log("items: ",items);
    res.json(items);
  } catch (err) {
    console.error("Error fetching items by neighborhood:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
