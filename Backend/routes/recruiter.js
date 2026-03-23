const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { getUserRepos } = require('../utils/github');
const { fetchReadme, parseReadmeWithAI, rankProjects, detectFlags, generateRecruiterVerdict } = require('../utils/recruiter');

const TWELVE_HOURS = 12 * 60 * 60 * 1000;

// POST /api/recruiter/:username
router.post('/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();

    // Check cache
    const cached = await Profile.findOne({ username });
    if (!cached) return res.status(404).json({ error: 'Profile not analyzed yet. Run /api/analyze first.' });

    if (cached.recruiterData && cached.recruiterData.cachedAt &&
        (Date.now() - new Date(cached.recruiterData.cachedAt).getTime()) < TWELVE_HOURS) {
      return res.json(cached.recruiterData);
    }

    // Fetch repos fresh for recruiter analysis
    const repos = await getUserRepos(username);
    const top5 = repos.filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5);

    // Fetch and parse READMEs
    const readmes = await Promise.all(top5.map(r => fetchReadme(username, r.name)));
    const parsed = await Promise.all(readmes.map(readme => readme ? parseReadmeWithAI(readme) : null));

    const topProjects = rankProjects(top5, parsed);
    const { green, red } = detectFlags(repos, cached.githubData);
    const recruiterVerdict = await generateRecruiterVerdict(
      username, green, red, topProjects[0], cached.verdict?.chemistryScore || 50
    );

    const recruiterData = { topProjects, green, red, recruiterVerdict, cachedAt: new Date() };

    // Save to Profile (extend schema dynamically via Mixed type)
    await Profile.updateOne({ username }, { $set: { recruiterData } });

    res.json(recruiterData);
  } catch (err) {
    console.error('Recruiter error:', err.message);
    res.status(500).json({ error: 'Recruiter analysis failed.', message: err.message });
  }
});

module.exports = router;
