const express = require('express');
const router = express.Router();
const ProfileCard = require('../models/ProfileCard');

router.get('/:regNumber', async (req, res) => {
  try {
    const profile = await ProfileCard.findOne({ regNumber: req.params.regNumber });
    if (!profile) {
      return res.json({
        regNumber: req.params.regNumber,
        username: '',
        email: '',
        linkedin: '',
        github: '',
        profilePic: ''
      });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.post('/save', async (req, res) => {
  try {
    const { regNumber, username, email, linkedin, github, profilePic } = req.body;

    if (!regNumber) {
      return res.status(400).json({ error: 'Registration number is required' });
    }

    const existingProfile = await ProfileCard.findOne({ regNumber });

    if (existingProfile) {
      existingProfile.username = username || existingProfile.username;
      existingProfile.email = email || existingProfile.email;
      existingProfile.linkedin = linkedin || existingProfile.linkedin;
      existingProfile.github = github || existingProfile.github;
      existingProfile.profilePic = profilePic || existingProfile.profilePic;

      const savedProfile = await existingProfile.save();
      return res.status(200).json({ 
        message: 'Profile updated successfully',
        profile: savedProfile
      });
    } else {
      const newProfile = new ProfileCard({
        regNumber,
        username,
        email,
        linkedin,
        github,
        profilePic,
      });

      const savedProfile = await newProfile.save();
      return res.status(201).json({ 
        message: 'Profile created successfully',
        profile: savedProfile
      });
    }
  } catch (err) {
    console.error('Error in profile save:', err);
    res.status(500).json({ 
      error: 'Server error',
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;