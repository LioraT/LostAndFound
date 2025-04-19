 const express = require('express');
 const bcrypt = require('bcrypt');
 const router = express.Router();
 const User = require("../models/user");
 
 const verifyToken = require("../middleware/authMiddleware");
 const adminOnly = require("../middleware/adminOnly");
 const mongoose = require('mongoose');
 
// Protected route
 router.get('/', verifyToken(), (req, res) => {
    res.status(200).json({ message: `Protected route accessed ${req.userId}` });
 });

 router.get('/profile', verifyToken(), async (req, res) => {
   try {
      const user = await User.findById(req.userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json(user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  router.put("/users/me/password", verifyToken(), async (req, res) => {
    const { current_password, new_password } = req.body;
  
    if (!current_password || !new_password) {
      return res.status(400).json({ error: "Both current and new passwords are required." });
    }
  
    try {
      const user = await User.findById(req.userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) {
        return res.status(403).json({ error: "Current password is incorrect." });
      }
  
      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: "Password updated successfully." });
    } catch (err) {
      console.error("Password update error:", err);
      res.status(500).json({ error: "Server error while updating password." });
    }
  });

  router.get("/users", verifyToken(), async (req, res) => {
    const search = req.query.search || "";
    const limit = parseInt(req.query.limit) || 12;
    const skip = parseInt(req.query.skip) || 0;
    console.log("in useres", limit, skip);
    try {
      const filter = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { first_name: { $regex: search, $options: "i" } },
          { family_name: { $regex: search, $options: "i" } },
        ],
      };
  
      const total = await User.countDocuments(filter);
  
      const users = await User.find(filter)
        .select("-password")
        .skip(skip)
        .limit(limit);
  
      res.json({ users, total });
    } catch (err) {
      console.error("User search error:", err);
      res.status(500).json({ error: "Failed to search users" });
    }
  });

  router.get("/users/:id", verifyToken(), adminOnly, async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err) {
      console.error("Error fetching user:", err);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  router.put("/users/me", verifyToken(), async (req, res) => {
    const allowedUpdates = ["first_name", "family_name", "email", "preferences", "date_of_birth"];
    const updates = {};
    for (let key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        updates,
        { new: true, runValidators: true }
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  
  router.put("/users/:id", verifyToken(), adminOnly, async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ message: "User updated", user: updatedUser });
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  router.delete("/users/:id", verifyToken(), adminOnly, async (req, res) => {
    try {
      if (req.params.id === req.userId) {
        return res.status(403).json({ error: "You cannot delete your own account from here." });
      }

      const deleted = await User.findByIdAndDelete(req.params.id);
  
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  module.exports = router;

