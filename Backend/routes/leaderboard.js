const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// GET /api/leaderboard — top 10 by chemistry score
router.get('/', async (req, res) => {
  try {
    const top = await Profile.find({})
      .sort({ 'verdict.chemistryScore': -1 })
      .limit(10)
      .select('username githubData verdict analysisCount');
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leaderboard/most-analyzed
router.get('/most-analyzed', async (req, res) => {
  try {
    const top = await Profile.find({})
      .sort({ analysisCount: -1 })
      .limit(10)
      .select('username githubData verdict analysisCount');
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
