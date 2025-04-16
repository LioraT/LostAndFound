// models/neighborhoodModel.js
const mongoose = require("mongoose");

const neighborhoodSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Feature'],
    required: true
  },
  properties: {
    shemshchun: String, // Or shemshchun if that's the field you're using
  },
  geometry: {
    type: {
      type: String,
      enum: ['Polygon', 'MultiPolygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // MultiPolygon compatible
      required: true
    }
  }
});

// Enable geospatial queries
neighborhoodSchema.index({ geometry: "2dsphere" });

const Neighborhood = mongoose.model("Neighborhood", neighborhoodSchema);
module.exports = Neighborhood;
