const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

router.get('/:regNumber', async (req, res) => {
  try {
    const user = await Registration.findOne({ regNumber: req.params.regNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;