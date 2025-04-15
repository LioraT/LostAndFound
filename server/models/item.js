
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner_name: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },

  item_type: {
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true
    },

    dateReported: {
      type: Date,
      default: Date.now
    },
    
    resolved: {
      type: Boolean,
      default: false
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'item',
      default: null
    }
  },

  title: {
    type: String,
    required: true,
    trim: true
  },
  item_category: {
    type: String,
    required: true
  },
  item_description: {
    type: String,
    required: true
  },
  photoUrl: {
    type: String
  },
  address: {
    type: String,
    required: true
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Geo index
itemSchema.index({ location: '2dsphere' });
// For fast queries on type (lost/found)
itemSchema.index({ "item_type.type": 1 });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
