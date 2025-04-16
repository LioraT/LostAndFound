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

// Generate test items (development only)
router.post('/test-data', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    
    if (users.length === 0) {
      console.log('No users found, creating test user');
      const testUser = new User({
        user_id: 1,
        user_name: 'testuser1',
        password: 'password123',
        first_name: 'Test',
        birth_date: new Date(),
        status: true,
        is_admin: false
      });
      await testUser.save();
      users.push(testUser);
    }

    await Item.deleteMany({});
    console.log('Cleared existing items');

    const baseLocation = [34.7818, 32.0853];
    const testItems = [];
    const areas = ['Florentin', 'Neve Tzedek', 'Rothschild', 'Dizengoff', 'Tel Aviv Port'];
    const itemTypes = ['lost', 'found'];
    const categories = ['phone', 'wallet', 'keys', 'backpack', 'jewelry'];

    for (let i = 0; i < 20; i++) {
      // Select a random user for each  
      const randomUser = users[Math.floor(Math.random() * users.length)];
      console.log(`Item ${i + 1} owner:`, { 
        id: randomUser._id, 
        name: randomUser.first_name,
        username: randomUser.user_name 
      });

      const latOffset = (Math.random() - 0.5) * 0.02;
      const lngOffset = (Math.random() - 0.5) * 0.02;
      const area = areas[Math.floor(Math.random() * areas.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];

      const itemData = {
        owner: randomUser._id,
        owner_name: randomUser.first_name,
        telephone: '050-1234567',
        title: `${area} ${type} item ${i + 1}`,
        item_category: category,
        item_description: `A ${category} that was ${type} in ${area}.`,
        item_type: {
          type: type,
          dateReported: new Date(),
          resolved: false,
          matchedWith: null
        },
        address: `${i + 1} ${area} Street, Tel Aviv`,
        location: {
          type: 'Point',
          coordinates: [
            baseLocation[0] + lngOffset,
            baseLocation[1] + latOffset
          ]
        }
      };

      const item = new Item(itemData);
      const savedItem = await item.save();
      testItems.push(savedItem);
    }

    const populatedItems = await Item.find().populate('owner', 'first_name user_name');

    res.json({ 
      message: `Created ${testItems.length} test items`,
      usersCount: users.length,
      items: populatedItems
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    res.status(500).json({ 
      error: 'Error creating test data',
      details: error.message,
      stack: error.stack
    });
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

module.exports = router;
