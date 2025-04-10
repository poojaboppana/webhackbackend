
const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  regNumber: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['badge', 'certificate'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String, // Store as base64 string or URL
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);