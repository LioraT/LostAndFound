 const express = require('express');
 const cors = require('cors');
 const mongoose = require('mongoose');
 require("dotenv").config();
 
 const app = express();
 const authRoutes = require('./routes/auth');
 const protectedRoute = require('./routes/protectedRoute');
 const itemsRoutes = require('./routes/items');
 const neighborhoods = require('./routes/neighborhoods');
 const devRoutes = require('./routes/devRoute');
 app.use(cors());
 app.use(express.json());
 
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI;
console.log(MONGO_URI);

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI, {});
      
    console.log('✅ Connected to MongoDB');

    app.use('/auth', authRoutes);
    app.use('/protected', protectedRoute);
    app.use('/items', itemsRoutes);
    app.use('/neighborhoods', neighborhoods);
    
    // Only use dev routes in development
    if (process.env.NODE_ENV === 'development') {
      app.use('/dev', devRoutes);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();