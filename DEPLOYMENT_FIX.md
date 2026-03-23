# GitJudge Deployment Fix Guide

## Current Status
- ✅ Frontend deployed: https://git-judge-8ca1.vercel.app
- ❌ Backend failing: https://gitjudge.onrender.com (500 errors)

## Root Cause
Backend is missing environment variables on Render.

---

## Fix Steps

### 1. Add Environment Variables to Render

Go to: https://dashboard.render.com → Your "gitjudge" service → Environment tab

Add these 4 variables:

#### MONGODB_URI
```
mongodb+srv://username:password@cluster.mongodb.net/gitjudge?retryWrites=true&w=majority
```
**Where to get it:**
1. Go to https://cloud.mongodb.com
2. Click "Database" → "Connect" → "Connect your application"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your MongoDB credentials

#### GEMINI_API_KEY
```
your_gemini_api_key_here
```
**Where to get it:**
1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

#### FRONTEND_URL
```
https://git-judge-8ca1.vercel.app
```
(This is for CORS - already correct)

#### GITHUB_TOKEN (Optional but recommended)
```
your_github_personal_access_token
```
**Where to get it:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `public_repo`, `read:user`
4. Copy the token

**Note:** Without this, GitHub API rate limits are 60 req/hr instead of 5000 req/hr.

---

### 2. Check MongoDB Atlas Network Access

1. Go to https://cloud.mongodb.com
2. Click "Network Access" in left sidebar
3. Make sure you have `0.0.0.0/0` in the IP Access List
4. If not:
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

---

### 3. Verify Render Settings

In Render dashboard → Your service:

- **Root Directory**: `Backend` (NOT blank, NOT `./Backend`)
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Branch**: `main`

---

### 4. Manual Redeploy

After adding environment variables:
1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait 2-3 minutes for deployment
3. Check logs for errors

---

### 5. Test Deployment

Once deployed, test these URLs:

#### Test 1: Wake endpoint
```
https://gitjudge.onrender.com/api/wake
```
Should return:
```json
{"status":"awake","version":"1.0.0"}
```

#### Test 2: Root endpoint
```
https://gitjudge.onrender.com/
```
Should return:
```json
{"status":"GitJudge API running","message":"I am the one who codes."}
```

#### Test 3: Frontend
```
https://git-judge-8ca1.vercel.app
```
Should load without errors.

---

## Common Issues

### Issue: "Missing required env vars"
**Fix:** Add MONGODB_URI and GEMINI_API_KEY to Render environment variables.

### Issue: "MongoDB error: connection refused"
**Fix:** Check MongoDB Atlas Network Access allows 0.0.0.0/0.

### Issue: "CORS error"
**Fix:** Make sure FRONTEND_URL is set to `https://git-judge-8ca1.vercel.app` in Render.

### Issue: "GitHub API 401"
**Fix:** Add GITHUB_TOKEN to Render (optional but recommended).

### Issue: Rate limiter error
**Fix:** Already fixed in latest code with `app.set('trust proxy', 1)`.

---

## Verification Checklist

- [ ] MONGODB_URI added to Render
- [ ] GEMINI_API_KEY added to Render
- [ ] FRONTEND_URL added to Render
- [ ] GITHUB_TOKEN added to Render (optional)
- [ ] MongoDB Atlas allows 0.0.0.0/0
- [ ] Render Root Directory is `Backend`
- [ ] Render deployed successfully
- [ ] https://gitjudge.onrender.com/api/wake returns 200
- [ ] https://git-judge-8ca1.vercel.app loads without errors
- [ ] Can analyze a GitHub profile

---

## Next Steps After Deployment Works

1. Test all features:
   - Analyze profile
   - Battle mode
   - Leaderboard
   - Job Fit
   - Resume Roast

2. Add screenshots to README.md

3. Set up UptimeRobot to keep Render awake:
   - https://uptimerobot.com
   - Monitor: https://gitjudge.onrender.com/api/wake
   - Interval: 5 minutes

4. Update resume with project links
