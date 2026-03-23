const express = require('express');
const router = express.Router();
const { analyzeUser } = require('./analyze');
const { generateBattleVerdict } = require('../utils/claude');

// POST /api/battle
router.post('/', async (req, res) => {
  try {
    const { username1, username2 } = req.body;
    if (!username1 || !username2) return res.status(400).json({ error: 'Two usernames required' });

    const [result1, result2] = await Promise.all([
      analyzeUser(username1.trim().toLowerCase()),
      analyzeUser(username2.trim().toLowerCase())
    ]);

    const battleVerdict = await generateBattleVerdict(
      { username: result1.username, chemistryScore: result1.verdict.chemistryScore, cookRank: result1.verdict.cookRank },
      { username: result2.username, chemistryScore: result2.verdict.chemistryScore, cookRank: result2.verdict.cookRank }
    );

    res.json({ user1: result1, user2: result2, battleVerdict });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'One or both GitHub users not found' });
    console.error('Battle error:', err.message);
    res.status(500).json({ error: 'Battle failed', message: err.message });
  }
});

module.exports = router;
