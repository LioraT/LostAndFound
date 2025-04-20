const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for a police station based on OSM data
const policestationSchema = new Schema({
  properties: {
    type: Object,
    required: true
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create a 2dsphere index on the 'geometry' field for geospatial queries
policestationSchema.index({ geometry: '2dsphere' });

// Create and export the model
const policestation = mongoose.model('policestation', policestationSchema);
module.exports = policestation;
