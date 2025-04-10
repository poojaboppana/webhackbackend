const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  regNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  leetcode: String,
  codechef: String,
  hackerearth: String,
  hackerrank: String,
  password: { type: String, required: true },
});

module.exports = mongoose.model('Registration', registrationSchema);
