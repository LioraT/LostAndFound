const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/user');
const debug = require('../utils/debug');


// Get all items
router.get('/', verifyToken(), async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get items within a specific area (for map bounds)
router.get('/area', verifyToken(), async (req, res) => {
  try {
    const { swLat, swLng, neLat, neLng } = req.query;
    const items = await Item.find({
      location: {
        $geoWithin: {
          $box: [
            [parseFloat(swLng), parseFloat(swLat)],
            [parseFloat(neLng), parseFloat(neLat)]
          ]
        }
      }
    }).populate('owner', 'first_name last_name email');

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new item (protected route)
router.post('/', verifyToken(), async (req, res) => {
  try {
    // Get the user first
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const item = new Item({
      ...req.body,
      owner: req.userId,          // Use req.userId instead of req.user._id
      owner_name: user.username // Use the found user's username
    });

    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get a single item
router.get('/id/:id', verifyToken(), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'first_name last_name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an item (protected route)
router.delete('/:id', verifyToken(), async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Get user to check if admin
    const user = await User.findById(req.userId);
    
    // Allow deletion if user is owner or admin
    if (item.owner.toString() !== req.userId.toString() && !user.is_admin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error in delete:', error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ NEW: put item in the DB by form
router.put('/', verifyToken(), async (req, res) => {
  try {
    // Get the user first
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const item = new Item({
      ...req.body,
      owner: req.userId,
      owner_name: user.username
    });

    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(400).json({ message: error.message });
  }
});

// 📍 GET /items/nearby
router.get('/nearby', verifyToken(), async (req, res) => {
  const {
    lat,
    lng,
    radius = 1500,
    item_category,
    item_type,
    resolved,
    keywords,
    self
  } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: "Missing lat or lng" });
  }

  // ✅ Build the query dynamically
  const query = {
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: parseFloat(radius),
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

  try {
    const items = await Item.find(query);
    res.json(items);
  } catch (err) {
    console.error("Error fetching nearby items:", err);
    res.status(500).json({ error: "Server error" });
  }
});


//
// POST /items/matching
router.post('/matching', verifyToken(), async (req, res) => {
  const { type, category, coordinates, radius, resolved } = req.body;

  if (!type || !category || !coordinates) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const oppositeType = type === 'lost' ? 'found' : 'lost';

  try {
    const query = {
      "item_type.type": oppositeType,
      item_category: category,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coordinates
          },
          $maxDistance: radius || 1500
        }
      }
    };

    // 🔥 Only add resolved filter if provided
    if (resolved !== undefined) {
      query["item_type.resolved"] = resolved === "true";  // Convert string to boolean
    }
    // Else: do nothing (both resolved & unresolved will be included)

    const matches = await Item.find(query);
    res.json(matches);
  } catch (err) {
    console.error("Error in /items/matching:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/resolved', verifyToken(), async (req, res) => {
  const { mainItemId, matchedItemId } = req.body;

  if (!mainItemId || !matchedItemId) {
    return res.status(400).json({ error: 'Both mainItemId and matchedItemId are required.' });
  }

  try {
    // Fetch both items
    const [mainItem, matchedItem] = await Promise.all([
      Item.findById(mainItemId),
      Item.findById(matchedItemId)
    ]);

    // Validate existence
    if (!mainItem || !matchedItem) {
      return res.status(404).json({ error: 'One or both items not found.' });
    }

    // Check if either is already resolved
    if (mainItem.item_type.resolved) {
      return res.status(400).json({ error: `Main item ${mainItemId} is already resolved.` });
    }
    if (matchedItem.item_type.resolved) {
      return res.status(400).json({ error: `Matched item ${matchedItemId} is already resolved.` });
    }

    // Proceed to resolve both items
    mainItem.item_type.resolved = true;
    mainItem.item_type.matchedWith = matchedItemId;

    matchedItem.item_type.resolved = true;
    matchedItem.item_type.matchedWith = mainItemId;

    // Save both items
    await Promise.all([
      mainItem.save(),
      matchedItem.save()
    ]);

    res.status(200).json({ message: 'Items resolved successfully.' });

  } catch (error) {
    console.error('Error resolving items:', error);
    res.status(500).json({ error: 'Server error while resolving items.' });
  }
});

module.exports = router;
