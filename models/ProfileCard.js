const mongoose = require('mongoose');

const profileCardSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true },
 
  email: { type: String, required: true },
  linkedin: { type: String },
  github: { type: String },
  profilePic: { type: String }, // base64 string
}, { timestamps: true });

module.exports = mongoose.model('ProfileCard', profileCardSchema);
