
const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');

// Get all achievements for a user
router.get('/:regNumber', async (req, res) => {
  try {
    const achievements = await Achievement.find({ regNumber: req.params.regNumber });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new achievement
router.post('/', async (req, res) => {
  const { regNumber, type, title, image } = req.body;
  
  const achievement = new Achievement({
    regNumber,
    type,
    title,
    image
  });

  try {
    const newAchievement = await achievement.save();
    res.status(201).json(newAchievement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update achievement
router.put('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });

    if (req.body.type) achievement.type = req.body.type;
    if (req.body.title) achievement.title = req.body.title;
    if (req.body.image) achievement.image = req.body.image;

    const updatedAchievement = await achievement.save();
    res.json(updatedAchievement);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete achievement
router.delete('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ message: 'Achievement not found' });

    await achievement.remove();
    res.json({ message: 'Achievement deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;