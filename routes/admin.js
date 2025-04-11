const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const axios = require('axios');

// Get all registrations
router.get('/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().select('-password -__v');
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get contest participants
router.post('/contest-participants', async (req, res) => {
  try {
    const { platform, contestName, department } = req.body;

    if (!platform || !contestName) {
      return res.status(400).json({ message: 'Platform and contest name are required' });
    }

    let query = {};
    if (department !== 'all') query.department = department;

    const registrations = await Registration.find(query).select(
      'regNumber email department leetcode codechef hackerearth hackerrank'
    );

    const participants = [];
    const stats = {
      totalParticipants: 0,
      averageRating: 0,
      departmentBreakdown: {},
    };

    let totalRating = 0;
    let ratedParticipants = 0;

    for (const student of registrations) {
      if (!student[platform]) continue;

      try {
        let response;
        if (platform === 'codechef') {
          response = await axios.get(`https://codechef-api.vercel.app/${student.codechef}`);
          const contestData = response.data.ratingData || [];
          const contest = contestData.find(
            (c) => c.name.toLowerCase() === contestName.toLowerCase()
          );

          if (contest) {
            const participantData = {
              regNumber: student.regNumber,
              email: student.email,
              department: student.department,
              [platform]: student[platform],
              rating: contest.rating || 'N/A',
              rank: contest.rank || 'N/A',
            };

            participants.push(participantData);
            stats.totalParticipants++;

            if (contest.rating && !isNaN(contest.rating)) {
              totalRating += parseFloat(contest.rating);
              ratedParticipants++;

              if (!stats.departmentBreakdown[student.department]) {
                stats.departmentBreakdown[student.department] = 0;
              }
              stats.departmentBreakdown[student.department]++;
            }
          }
        } else if (platform === 'leetcode') {
          // LeetCode API typically doesn't provide contest-specific ranks in the same way
          // Placeholder for LeetCode contest logic (modify based on actual API)
          response = await axios.get(
            `https://leetcode-stats-api.herokuapp.com/${student.leetcode}`
          );
          // Assuming LeetCode API returns contest data (hypothetical)
          const contestData = response.data.contests || [];
          const contest = contestData.find(
            (c) => c.contestName.toLowerCase() === contestName.toLowerCase()
          );

          if (contest) {
            const participantData = {
              regNumber: student.regNumber,
              email: student.email,
              department: student.department,
              [platform]: student[platform],
              rating: contest.rating || 'N/A',
              rank: contest.rank || 'N/A',
            };

            participants.push(participantData);
            stats.totalParticipants++;

            if (contest.rating && !isNaN(contest.rating)) {
              totalRating += parseFloat(contest.rating);
              ratedParticipants++;

              if (!stats.departmentBreakdown[student.department]) {
                stats.departmentBreakdown[student.department] = 0;
              }
              stats.departmentBreakdown[student.department]++;
            }
          }
        }
        // Add similar logic for hackerrank and hackerearth if APIs are available
      } catch (err) {
        console.error(`Error fetching ${platform} data for ${student[platform]}:`, err.message);
      }
    }

    if (ratedParticipants > 0) {
      stats.averageRating = (totalRating / ratedParticipants).toFixed(2);
    } else {
      stats.averageRating = 'N/A';
    }

    res.json({ participants, stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;