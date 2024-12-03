const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  websiteUrl: {
    type: String,
    trim: true
  },
  price: {
    type: String,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low', ''],
    default: ''
  },
  category: {
    type: String,
    enum: ['electronics', 'clothing', 'home', 'other', ''],
    default: ''
  },
  notes: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema); 