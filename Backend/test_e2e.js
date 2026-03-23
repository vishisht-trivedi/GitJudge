// End-to-end test — simulates what the route does, without needing a real PDF
require('dotenv').config();
const { getUserProfile, getUserRepos } = require('./utils/github');
const { extractResumeClaims } = require('./utils/resumeParser');
const { crossReference, calcMatchScore, generateGapVerdict } = require('./utils/resumeGap');

const FAKE_RESUME = `
Vishisht Trivedi
vishisht@example.com | github.com/vishisht-trivedi

SKILLS
JavaScript, React, Node.js, Python, MongoDB, Express, CSS, HTML, Git

PROJECTS
GitJudge - A Breaking Bad themed GitHub profile analyzer built with React and Node.js
PushClash - GitHub battle mode comparison tool

EXPERIENCE
2 years of JavaScript development
1 year of React frontend development

EDUCATION
B.Tech Computer Science, 2025
`;

async function run() {
  const username = 'vishisht-trivedi';
  console.log('Testing full resume roast pipeline...\n');

  const [profile, repos] = await Promise.all([
    getUserProfile(username),
    getUserRepos(username),
  ]);
  console.log(`GitHub: ${profile.login}, ${repos.length} repos, created ${profile.created_at}`);

  const githubData = {
    top_languages: (() => {
      const map = {};
      repos.forEach(r => { if (r.language) map[r.language] = (map[r.language] || 0) + 1; });
      return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([l]) => l);
    })(),
    repos,
    created_at: profile.created_at,
  };

  const parsed = await extractResumeClaims(FAKE_RESUME);
  console.log(`Parsed: ${parsed.claims?.length} claims, top skills: ${parsed.topSkills?.join(', ')}`);

  if (!parsed.claims?.length) {
    console.error('FAIL: Gemini returned empty parse — likely rate limited');
    process.exit(1);
  }

  const results = crossReference(parsed.claims, githubData);
  const score = calcMatchScore(results);
  console.log(`\nCross-reference results (${results.length} total, score: ${score}%):`);
  results.forEach(r => console.log(`  [${r.status.padEnd(10)}] ${r.skill} -- ${r.evidence}`));

  const verdict = await generateGapVerdict(username, score, results, parsed.name);
  console.log(`\nVerdict: ${verdict.verdict}`);
  console.log(`Fraud score: ${verdict.fraudScore}`);
  console.log(`Quote: "${verdict.walterQuote}"`);
  console.log(`Action plan: ${verdict.actionPlan?.length} steps`);
  console.log('\nPASS');
}

run().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
