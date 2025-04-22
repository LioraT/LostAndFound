// testDataGenerator.js

const express = require('express');
const mongoose = require('mongoose');
const Item = require('./models/item');
const User = require('./models/user'); 
require("dotenv").config();


const app = express();
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI;

async function generateTestData() {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('Connected to MongoDB');
  
      const users = await User.find()
        .select('username first_name family_name email _id')
        .lean();
  
      if (users.length === 0) {
        console.log('No users found, creating test user');
        const testUser = new User({
          username: 'testuser1',
          password: 'password123',
          first_name: 'Test',
          family_name: 'User',
          date_of_birth: new Date(),
          email: 'test@example.com',
          is_admin: false
        });
        await testUser.save();
        users.push(testUser.toObject());
      }
  
      await Item.deleteMany({});
      console.log('Cleared existing items');
  
      const baseLocation = [34.7818, 32.0853];
      const areas = ['Florentin', 'Neve Tzedek', 'Rothschild', 'Dizengoff', 'Tel Aviv Port'];
      const itemTypes = ['lost', 'found'];
      const categories = ['phone', 'wallet', 'keys', 'backpack', 'jewelry'];
      const testItems = [];
  
      for (let i = 0; i < 20; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
  
        if (!randomUser.username) {
          console.error('Missing username for user:', randomUser);
          continue;
        }
  
        const latOffset = (Math.random() - 0.5) * 0.02;
        const lngOffset = (Math.random() - 0.5) * 0.02;
        const area = areas[Math.floor(Math.random() * areas.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  
        const itemData = {
          owner: randomUser._id,
          owner_name: randomUser.username,
          telephone: '050-1234567',
          title: `${area} ${type} item ${i + 1}`,
          item_category: category,
          item_description: `A ${category} that was ${type} in ${area}.`,
          item_type: {
            type,
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
  
      console.log(`✅ Created ${testItems.length} test items`);
  
      const populatedItems = await Item.find().populate('owner', 'username first_name').lean();
      console.log('Preview of created items:', populatedItems.slice(0, 3)); // Just preview 3 items
  
    } catch (error) {
      console.error('❌ Error generating test data:', error);
    } finally {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  }
  
  generateTestData();