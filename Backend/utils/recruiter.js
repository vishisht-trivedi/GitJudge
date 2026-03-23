const axios = require('axios');
const { generateJSON } = require('./ai');

const headers = () => ({
  'User-Agent': 'GitJudge-App',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
});

async function fetchReadme(username, repoName) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/readme`,
      { headers: headers() }
    );
    return Buffer.from(res.data.content, 'base64').toString('utf8');
  } catch { return null; }
}

async function parseReadmeWithAI(readmeText) {
  try {
    const prompt = `Extract the following from this GitHub README as JSON only. No markdown. No extra text. Just the JSON object.
{
  "summary": "one sentence — what this project does",
  "techStack": ["array", "of", "technologies", "mentioned"],
  "useCase": "who uses this and what problem it solves",
  "liveUrl": "live demo URL if present, else null",
  "projectType": "web app | library | cli tool | mobile | api | other",
  "quality": "high | medium | low based on README completeness"
}
README content:
${readmeText.slice(0, 3000)}`;
    return await generateJSON(prompt);
  } catch {
    return { summary: 'No summary available', techStack: [], useCase: '', liveUrl: null, projectType: 'other', quality: 'low' };
  }
}

function calcProjectScore(repo, parsed) {
  let score = 0;
  if (parsed?.liveUrl) score += 20;
  if (parsed?.quality === 'high') score += 20;
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  if (repo.pushed_at && new Date(repo.pushed_at) > ninetyDaysAgo) score += 15;
  if (!repo.fork) score += 15;
  score += Math.min(15, (repo.stargazers_count || 0));
  return score;
}

function rankProjects(repos, parsedReadmes) {
  return repos
    .map((repo, i) => ({ ...repo, ...(parsedReadmes[i] || {}), score: calcProjectScore(repo, parsedReadmes[i]) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function detectFlags(repos, profile) {
  const green = [], red = [];
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const noDesc = repos.filter(r => !r.description).length;
  const forks = repos.filter(r => r.fork).length;
  const recentActivity = repos.some(r => new Date(r.pushed_at) > ninetyDaysAgo);
  const multiLang = new Set(repos.map(r => r.language).filter(Boolean)).size;
  const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);

  if (noDesc < repos.length * 0.4) green.push({ title: 'Well-documented repos', detail: 'Most repos have descriptions — shows professionalism.' });
  if (recentActivity) green.push({ title: 'Active in last 90 days', detail: 'Recent commits signal an engaged, active developer.' });
  if (multiLang >= 3) green.push({ title: `${multiLang} languages used`, detail: 'Polyglot developer — versatile and adaptable.' });
  if (totalStars >= 10) green.push({ title: `${totalStars} total stars earned`, detail: 'External validation from other developers.' });
  if (forks < repos.length * 0.4) green.push({ title: 'Mostly original work', detail: 'High ratio of original repos shows initiative.' });
  if (profile.bio) green.push({ title: 'Has a bio', detail: 'First impression matters — bio shows self-awareness.' });
  if (profile.followers >= 10) green.push({ title: `${profile.followers} followers`, detail: 'Community recognition and network presence.' });

  if (noDesc > repos.length * 0.5) red.push({ title: `${noDesc} repos without description`, detail: 'Recruiters skip repos with no context. Fix these.' });
  if (forks > repos.length * 0.5) red.push({ title: 'High fork ratio', detail: 'More than half are forks — shows less original work.' });
  if (!recentActivity) red.push({ title: 'No activity in 90+ days', detail: 'Inactive profile raises questions about current engagement.' });
  if (!profile.bio) red.push({ title: 'Empty bio', detail: 'Missed first impression — recruiters notice this immediately.' });
  if (multiLang <= 1) red.push({ title: 'Single language only', detail: 'Limited versatility signal for most roles.' });

  return { green, red };
}

async function generateRecruiterVerdict(username, greenFlags, redFlags, topProject, chemistryScore) {
  try {
    const prompt = `You are Walter White evaluating a developer's GitHub profile for a recruiter.
Be precise, cold, and use chemistry metaphors. Return ONLY valid JSON:
{
  "hireGrade": "A+ | A | B | C | D | F",
  "verdictText": "3-4 sentences. Cold, precise, chemistry metaphors. Specific to their stats.",
  "recommendation": "STRONG HIRE | HIRE | CONDITIONAL | PASS | HARD PASS",
  "oneLineVerdict": "Under 12 words. Memorable. Brutal if warranted."
}
Developer stats:
- Username: ${username}
- Green flags: ${greenFlags.length} (${greenFlags.map(f => f.title).join(', ')})
- Red flags: ${redFlags.length} (${redFlags.map(f => f.title).join(', ')})
- Top project: ${topProject?.name || 'unknown'} — ${topProject?.summary || 'no summary'}
- Chemistry score: ${chemistryScore}/100`;
    return await generateJSON(prompt, `recruiter:${username}`);
  } catch {
    return { hireGrade: 'B', verdictText: 'The analysis is complete. The product is adequate.', recommendation: 'CONDITIONAL', oneLineVerdict: 'Adequate chemistry. Needs more lab time.' };
  }
}

module.exports = { fetchReadme, parseReadmeWithAI, rankProjects, detectFlags, generateRecruiterVerdict };
