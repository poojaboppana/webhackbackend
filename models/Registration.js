// models/Registration.js
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  regNumber: { type: String, required: true, unique: true },
  leetcode: String,
  codechef: String,
  hackerearth: String,
  hackerrank: String,
  password: { type: String, required: true },
});

module.exports = mongoose.model('Registration', registrationSchema);
