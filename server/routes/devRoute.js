const express = require('express');
const router = express.Router();
const Item = require('../models/item');
const User = require('../models/user');
const verifyToken = require('../middleware/authMiddleware');

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
  
module.exports = router;