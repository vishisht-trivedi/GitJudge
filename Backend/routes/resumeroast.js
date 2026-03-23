const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const { extractResumeClaims } = require('../utils/resumeParser');
const { crossReference, calcMatchScore, generateGapVerdict } = require('../utils/resumeGap');

const router = express.Router();

// Store in memory — no disk writes needed
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are accepted'));
  }
});

const GITHUB_HEADERS = () => ({
  'User-Agent': 'GitJudge-App',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
});

router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const { username } = req.body;

    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });
    if (!username) return res.status(400).json({ error: 'GitHub username is required' });

    // 1. Extract text from PDF
    let resumeText;
    try {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } catch (err) {
      return res.status(400).json({ error: 'Could not read PDF. Make sure it is a text-based PDF, not a scanned image.' });
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'PDF appears to be empty or image-only. Use a text-based PDF.' });
    }

    // 2. Fetch GitHub profile + repos
    let profile, repos;
    try {
      const [profileRes, reposRes] = await Promise.all([
        axios.get(`https://api.github.com/users/${username}`, { headers: GITHUB_HEADERS() }),
        axios.get(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`, { headers: GITHUB_HEADERS() })
      ]);
      profile = profileRes.data;
      repos = reposRes.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return res.status(404).json({ error: `GitHub user "${username}" not found` });
      }
      return res.status(502).json({ error: 'Failed to fetch GitHub data. Try again.' });
    }

    // 3. Build GitHub summary for cross-reference
    const langCounts = {};
    repos.forEach(r => { if (r.language) langCounts[r.language] = (langCounts[r.language] || 0) + 1; });
    const top_languages = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([lang]) => lang);

    const githubData = { top_languages, repos };

    // 4. Extract resume claims via Gemini
    let parsed;
    try {
      parsed = await extractResumeClaims(resumeText);
    } catch (err) {
      if (err.message?.includes('exhausted')) {
        return res.status(503).json({ error: 'AI service is temporarily rate-limited. Please try again in a minute.' });
      }
      throw err;
    }

    if (!parsed?.claims?.length) {
      return res.status(422).json({ error: 'Could not extract claims from resume. Make sure it contains technical skills and experience.' });
    }

    // 5. Cross-reference + score
    const crossRefResults = crossReference(parsed.claims, githubData);
    const matchScore = calcMatchScore(crossRefResults);

    // 6. Generate Walter's verdict
    const verdict = await generateGapVerdict(username, matchScore, crossRefResults, parsed.name);

    res.json({
      username,
      candidateName: parsed.name || username,
      matchScore,
      topSkills: parsed.topSkills || [],
      yearsExperience: parsed.yearsExperience,
      roles: parsed.roles || [],
      claims: crossRefResults,
      verdict,
      githubStats: {
        totalRepos: repos.length,
        topLanguages: top_languages,
        followers: profile.followers,
        publicRepos: profile.public_repos
      }
    });

  } catch (err) {
    console.error('Resume roast error:', err.message);
    res.status(500).json({ error: 'Analysis failed. ' + err.message });
  }
});

module.exports = router;
