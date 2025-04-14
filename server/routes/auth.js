 const express = require('express');
 const router = express.Router();
 const User = require('../models/user');
 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');

// User registration
 router.post('/register', async (req, res) => {
 try {
 /* const { username, password } = req.body; */
 const {
    username,
    password,
    first_name,
    family_name,
    date_of_birth,
    email,
    preferences,
//  is_admin, // optional — only settable if you allow it
//  preferences, // optional — e.g., { page_size: 20 }
  } = req.body;

 const hashedPassword = await bcrypt.hash(password, 10);
// const user = new User({ username, password: hashedPassword });
 const user = new User({
    username,
    password: hashedPassword,
    first_name,
    family_name,
    date_of_birth,
    email,
    preferences: {
      page_size: preferences?.page_size || 12,
    },
    // is_admin defaults to false
 });

 await user.save();
 res.status(201).json({ message: 'User registered successfully' });
} catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      const field = Object.keys(err.keyPattern)[0];
      res.status(400).json({
        error: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    } else if (err.name === 'ValidationError') {
      // Mongoose schema validation error
      const messages = Object.values(err.errors).map(e => e.message);
      res.status(400).json({ error: messages.join(', ') });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Internal server error,  Registration failed' });
    }
  }
 });

// User login
 router.post('/login', async (req, res) => {
 try {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
  return res.status(401).json({ error: 'Authentication failed' });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
  return res.status(401).json({ error: 'Authentication failed' });
  }
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    throw new Error("JWT secret is missing from environment variables");
  }
  const token = jwt.sign({ userId: user._id }, secretKey, {
    expiresIn: '1h',
  });
  res.status(200).json({ token });
 } catch (error) {
  res.status(500).json({ error: 'Login failed' });
 }
 });

module.exports = router;