const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { getUserProfile, getUserRepos, transformGithubData } = require('../utils/github');
const { computeChemistryScore, getCookRank, generateRoast } = require('../utils/claude');

const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 hours

async function analyzeUser(username) {
  // Check MongoDB cache
  const cached = await Profile.findOne({ username: username.toLowerCase() });
  if (cached && (Date.now() - cached.updatedAt.getTime()) < CACHE_TTL) {
    cached.analysisCount += 1;
    await cached.save();
    return { ...cached.toObject(), fromCache: true };
  }

  // Fetch fresh data
  const profile = await getUserProfile(username);
  const repos = await getUserRepos(username);
  const { githubData, stats } = transformGithubData(profile, repos);
  const { chemistryScore, stats: scoreStats } = computeChemistryScore(stats);
  const rank = getCookRank(chemistryScore);
  const roast = await generateRoast(username, { githubData, stats });

  const verdict = {
    cookRank: rank.name,
    chemistryScore,
    roastText: roast.roastText,
    quote: roast.quote,
    tags: roast.tags,
    verdict: roast.verdict,
    stats: scoreStats
  };

  // Upsert to MongoDB
  const doc = await Profile.findOneAndUpdate(
    { username: username.toLowerCase() },
    { username: username.toLowerCase(), githubData, verdict, updatedAt: new Date(), $inc: { analysisCount: cached ? 1 : 0 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { ...doc.toObject(), fromCache: false };
}

// POST /api/analyze
router.post('/', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: 'Username required' });

    const result = await analyzeUser(username.trim().toLowerCase());
    res.json(result);
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'GitHub user not found' });
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed', message: err.message });
  }
});

// GET /api/analyze/:username — fetch cached
router.get('/:username', async (req, res) => {
  try {
    const doc = await Profile.findOne({ username: req.params.username.toLowerCase() });
    if (!doc) return res.status(404).json({ error: 'Not yet analyzed' });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
module.exports.analyzeUser = analyzeUser;
