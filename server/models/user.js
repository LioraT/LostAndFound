const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
 username: { type: String, unique: true, required: true },
 password: { type: String, required: true },
 first_name: { type: String, required: true, maxLength: 100 },
 family_name: { type: String, required: true, maxLength: 100 },
 date_of_birth: { type: Date },
 email: {
    type: String,
    required: true,
    unique: true,          // 💡 ensures emails are not duplicated
    lowercase: true,       // 💡 converts email to lowercase before saving
    trim: true,            // 💡 removes whitespace around the email
    match: [
      /^\S+@\S+\.\S+$/,    // 💡 simple regex for email format
      'Please enter a valid email address',
    ],
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  preferences: {
    page_size: {
      type: Number,
      default: 12,
    },
  },
  
 });
module.exports = mongoose.model('User', userSchema);