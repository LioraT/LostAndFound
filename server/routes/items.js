const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/user');


// Get all items
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get items within a specific area (for map bounds)
router.get('/area', verifyToken, async (req, res) => {
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
router.post('/', verifyToken, async (req, res) => {
  try {
    // Get the user first
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const item = new Item({
      ...req.body,
      owner: req.userId,          // Use req.userId instead of req.user._id
      owner_name: user.first_name // Use the found user's first_name
    });

    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(400).json({ message: error.message });
  }
});

// Get a single item
router.get('/:id', verifyToken, async (req, res) => {
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
router.delete('/:id', verifyToken, async (req, res) => {
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
router.put('/', verifyToken, async (req, res) => {
  try {
    // Get the user first
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const item = new Item({
      ...req.body,
      owner: req.userId,
      owner_name: user.first_name
    });

    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(400).json({ message: error.message });
  }
});


module.exports = router;