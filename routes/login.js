const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Hardcoded admin credentials
const ADMIN = {
  regNumber: 'admin123',
  password: 'adminpass',
};

router.post('/', async (req, res) => {
  const { regNumber, password, role } = req.body;

  if (!regNumber || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    if (role === 'admin') {
      // Check hardcoded admin credentials
      if (regNumber === ADMIN.regNumber && password === ADMIN.password) {
        return res.status(200).json({ message: 'Admin login successful', role: 'admin' });
      } else {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    } else if (role === 'student') {
      // Check student login from DB
      const student = await Registration.findOne({ regNumber, password });

      if (!student) {
        return res.status(401).json({ message: 'Invalid registration number or password' });
      }

      return res.status(200).json({ message: 'Student login successful', role: 'student', student });
    } else {
      return res.status(400).json({ message: 'Invalid role selected' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
