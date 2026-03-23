const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const { getUserProfile, getUserRepos, transformGithubData } = require('../utils/github');
const { extractSkillsFromJD, matchSkillsToGitHub, calculateReadiness, generateJobVerdict } = require('../utils/jobfit');

// POST /api/jobfit
router.post('/', async (req, res) => {
  try {
    const { username, jobDescription, roleName } = req.body;
    if (!username || !jobDescription) {
      return res.status(400).json({ error: 'Username and job description required.' });
    }

    const u = username.trim().toLowerCase();

    // Use cached profile or fetch fresh
    let profileDoc = await Profile.findOne({ username: u });
    let profileData;

    if (profileDoc) {
      profileData = {
        top_languages: profileDoc.githubData.top_languages || [],
        repos: [] // repos not stored in Profile model — fetch fresh
      };
    }

    // Always fetch repos for skill matching (not cached in Profile)
    const [ghProfile, repos] = await Promise.all([
      getUserProfile(u),
      getUserRepos(u)
    ]);
    const { githubData, stats } = transformGithubData(ghProfile, repos);

    profileData = {
      top_languages: githubData.top_languages || [],
      repos: repos.map(r => ({
        name: r.name,
        description: r.description,
        language: r.language,
        topics: r.topics || [],
        fork: r.fork,
        stargazers_count: r.stargazers_count,
        pushed_at: r.pushed_at
      }))
    };

    // Extract skills from JD
    const skills = await extractSkillsFromJD(jobDescription);
    if (skills.length === 0) {
      return res.status(400).json({ error: 'Could not extract skills from job description. Try a more detailed JD.' });
    }

    // Match skills to GitHub
    const skillMatches = matchSkillsToGitHub(skills, profileData);
    const readinessScore = calculateReadiness(skillMatches);
    const verdict = await generateJobVerdict(u, roleName, readinessScore, skillMatches);

    res.json({
      username: u,
      roleName: roleName || 'Software Engineer',
      readinessScore,
      skillMatches,
      verdict,
      githubData: {
        name: ghProfile.name || ghProfile.login,
        avatar_url: ghProfile.avatar_url,
        top_languages: githubData.top_languages
      }
    });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'GitHub user not found.' });
    console.error('JobFit error:', err.message);
    res.status(500).json({ error: 'Job fit analysis failed.', message: err.message });
  }
});

module.exports = router;
