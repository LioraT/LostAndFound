// server/routes/neighborhoods.js (or wherever your routes live)
 const express = require('express');
 const router = express.Router();
 const verifyToken = require("../middleware/authMiddleware");
 const Item = require("../models/item");
 //const adminOnly = require("../middleware/adminOnly");
// const mongoose = require('mongoose');

const Neighborhood = require("../models/neighborhoodModel"); // Adjust path as needed

router.post("/find-by-coordinates",verifyToken, async (req, res) => {
  const { lng, lat } = req.body;

  if (lng == null || lat == null) {
    return res.status(400).json({ error: "Missing coordinates" });
  }
  console.log("in find cooo",lng, lat);
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
    console.log("neg",neighborhood.properties.shemshchun);
    return res.json({ shemshchun: neighborhood.properties.shemshchun }); 
  } catch (err) {
    console.error("Error finding neighborhood:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /neighborhoods/by-name/:shemshchun
router.get('/by-name/:shemshchun', verifyToken, async (req, res) => {
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


router.get('/by-neighborhood/:shemshchun', verifyToken, async (req, res) => {
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
console.log("itemes: ",items);
    res.json(items);
  } catch (err) {
    console.error("Error fetching items by neighborhood:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
