const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// ── Startup env check ────────────────────────────────────────────
const REQUIRED_ENV = ['MONGODB_URI', 'GEMINI_API_KEY', 'GITHUB_TOKEN'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Missing required env vars:', missing.join(', '));
  console.error('Copy Backend/.env.example to Backend/.env and fill in values.');
  process.exit(1);
}

const analyzeRoutes    = require('./routes/analyze');
const battleRoutes     = require('./routes/battle');
const leaderboardRoutes = require('./routes/leaderboard');
const recruiterRoutes  = require('./routes/recruiter');
const jobfitRoutes     = require('./routes/jobfit');
const resumeRoastRoutes = require('./routes/resumeroast');

const app = express();
const PORT = process.env.PORT || 5000;

// ── MongoDB ──────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err.message));

// ── CORS ─────────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// ── Rate limiting ────────────────────────────────────────────────
const standardLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Even Heisenberg takes breaks.' }
});

const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many resume uploads. Come back in 15 minutes.' }
});

app.use('/api/', standardLimit);
app.use('/api/resumeroast', uploadLimit);

// ── Routes ───────────────────────────────────────────────────────
app.use('/api/analyze',     analyzeRoutes);
app.use('/api/battle',      battleRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/recruiter',   recruiterRoutes);
app.use('/api/jobfit',      jobfitRoutes);
app.use('/api/resumeroast', resumeRoastRoutes);

app.get('/',         (req, res) => res.json({ status: 'GitJudge API running', message: 'I am the one who codes.' }));
app.get('/api/wake', (req, res) => res.json({ status: 'awake', version: '1.0.0' }));

// ── Global error handler ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`GitJudge server running on port ${PORT}`));
