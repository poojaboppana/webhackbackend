const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

router.post('/', async (req, res) => {
  const {
    email,
    regNumber,
    department,
    leetcode,
    codechef,
    hackerearth,
    hackerrank,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const existingUser = await Registration.findOne({
      $or: [{ email }, { regNumber }],
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or Registration number already exists' });
    }

    const newUser = new Registration({
      email,
      regNumber,
      department,
      leetcode,
      codechef,
      hackerearth,
      hackerrank,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
