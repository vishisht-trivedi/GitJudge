# GitJudge

> "I am the one who codes." — Walter White

A Breaking Bad-themed GitHub profile analyzer. Paste a GitHub username, get roasted by Heisenberg.

## Features

| Feature | Route | Description |
|---|---|---|
| Profile Analyzer | `/` | GitHub stats → Cook Rank + Walter's roast |
| Battle Mode | `/battle` | 1v1 GitHub profile comparison |
| Leaderboard | `/leaderboard` | Top analyzed profiles |
| Recruiter Mode | `/result/:user` (toggle) | AI project showcase + red/green flags for hiring managers |
| Job Fit | `/job-fit` | Paste a JD → skill match score + action plan |
| Resume Roast | `/resume-roast` | Upload PDF resume → cross-reference every claim vs GitHub |

## Stack

- **Frontend**: React + Vite, lucide-react, react-router-dom
- **Backend**: Node.js + Express + MongoDB Atlas
- **AI**: Google Gemini 2.5 Flash
- **PDF**: multer + pdf-parse

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))
- GitHub Personal Access Token

### Backend

```bash
cd Backend
cp .env.example .env
# Fill in .env with your keys
npm install
npm start
```

### Frontend

```bash
cd Frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

## Environment Variables

### Backend `.env`

```
PORT=5000
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=AIzaSy...
GITHUB_TOKEN=ghp_...
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```
VITE_API_URL=http://localhost:5000
```

## Deployment

### Backend (Railway / Render / Fly.io)
- Set all env vars from `.env.example` in your platform dashboard
- `npm start` runs `node server.js`
- Set `FRONTEND_URL` to your deployed frontend URL

### Frontend (Vercel / Netlify)
- Set `VITE_API_URL` to your deployed backend URL
- Build command: `npm run build`
- Output directory: `dist`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/analyze` | Analyze GitHub profile |
| POST | `/api/battle` | Compare two profiles |
| GET | `/api/leaderboard` | Top profiles |
| POST | `/api/recruiter/:username` | Recruiter intelligence report |
| POST | `/api/jobfit` | Job description fit analysis |
| POST | `/api/resumeroast` | Resume PDF vs GitHub cross-reference |
| GET | `/api/wake` | Health check |

---

Built by [Vishisht Trivedi](https://github.com/vishisht-trivedi)
