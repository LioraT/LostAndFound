 const express = require('express');
 const router = express.Router();
 const verifyToken = require("../middleware/authMiddleware");
 const Item = require("../models/item");
 const debug = require('../utils/debug');
 const { hebrewStr } = require('../utils/hebrewUtils');
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
    const ne_name = hebrewStr(neighborhood.properties.shemshchun);
    debug.log("neighborhood: ",ne_name);
    return res.json({ shemshchun: neighborhood.properties.shemshchun }); 
  } catch (err) {
    console.error("Error finding neighborhood:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// GET /neighborhoods/by-name/:shemshchun = Get polygon
router.get('/by-name/:shemshchun', verifyToken(), async (req, res) => {
  const { shemshchun } = req.params; // destructuring

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

// Get items within neighborhood polygon (with filters)
router.get('/by-neighborhood/:shemshchun', verifyToken(), async (req, res) => {
  const { shemshchun } = req.params; // destructuring
  const {
    item_category,
    item_type,
    resolved,
    keywords,
    self
  } = req.query;

  try {
    const neighborhood = await Neighborhood.findOne({ "properties.shemshchun": shemshchun });
    if (!neighborhood) {
      return res.status(404).json({ error: "Neighborhood not found" });
    }

    const query = {
      location: {
        $geoWithin: {
          $geometry: neighborhood.geometry
        }
      }
    };

    if (item_category) {
      query.item_category = item_category;
    }

    if (self === 'true') {
      query.owner = req.userId;
    }

    if (item_type) {
      query["item_type.type"] = item_type;
    }

    if (resolved === "true" || resolved === "false") {
      query["item_type.resolved"] = resolved === "true";
    }

    if (keywords) {
      const regex = new RegExp(keywords, "i");
      query.$or = [
        { title: { $regex: regex } },
        { item_description: { $regex: regex } }
      ];
    }

    const items = await Item.find(query);
    res.json(items);
  } catch (err) {
    console.error("Error fetching items by neighborhood:", err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
