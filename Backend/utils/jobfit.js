const { generateJSON } = require('./ai');

async function extractSkillsFromJD(jdText) {
  try {
    const prompt = `Extract all technical skills from this job description as JSON only. No markdown. Return:
{
  "required": ["skill1", "skill2"],
  "preferred": ["skill3"],
  "experience": "senior | mid | junior",
  "domain": "backend | frontend | fullstack | devops | ml | other"
}
Job description: ${jdText.slice(0, 2000)}`;
    const parsed = await generateJSON(prompt);
    return parsed.required || [];
  } catch {
    return [];
  }
}

function matchSkillsToGitHub(skills, profileData) {
  const { top_languages = [], repos = [] } = profileData;
  const allLangs = top_languages.map(l => l.toLowerCase());
  const repoTopics = repos.flatMap(r => r.topics || []);
  const repoNames = repos.map(r => (r.name || '').toLowerCase());
  const descriptions = repos.map(r => (r.description || '').toLowerCase()).join(' ');

  return skills.map(skill => {
    const s = skill.toLowerCase();
    const inLanguages = allLangs.some(l => l.includes(s) || s.includes(l));
    const inTopics = repoTopics.some(t => t.includes(s));
    const inRepoNames = repoNames.some(n => n.includes(s));
    const inDescriptions = descriptions.includes(s);
    const signals = [inLanguages, inTopics, inRepoNames, inDescriptions].filter(Boolean);

    let evidence = '';
    if (inLanguages) evidence += 'Found in languages. ';
    if (inTopics) evidence += 'Found in repo topics. ';
    if (inRepoNames) evidence += 'Found in repo names. ';
    if (inDescriptions) evidence += 'Found in repo descriptions. ';
    if (!evidence) evidence = 'No direct GitHub evidence found.';

    return {
      skill,
      status: signals.length >= 2 ? 'match' : signals.length === 1 ? 'partial' : 'missing',
      evidence: evidence.trim(),
      strength: signals.length
    };
  });
}

function calculateReadiness(skillMatches) {
  const total = skillMatches.length;
  if (total === 0) return 0;
  const score = skillMatches.reduce((sum, s) => sum + (s.status === 'match' ? 1 : s.status === 'partial' ? 0.5 : 0), 0);
  return Math.round((score / total) * 100);
}

async function generateJobVerdict(username, roleName, score, skillMatches) {
  try {
    const matched = skillMatches.filter(s => s.status === 'match').map(s => s.skill);
    const missing = skillMatches.filter(s => s.status === 'missing').map(s => s.skill);
    const prompt = `You are Walter White evaluating ${username} for the role of ${roleName || 'Software Engineer'}.
Their job readiness score is ${score}%.
Skills they have: ${matched.join(', ') || 'none detected'}
Skills they lack: ${missing.join(', ') || 'none'}
Return ONLY valid JSON:
{
  "verdictText": "3-4 sentences. Walter White voice. Reference specific skills. Chemistry metaphors.",
  "quote": "One brutal/funny line about their readiness. Under 15 words.",
  "fitRank": "Overqualified | Strong Fit | Good Fit | Partial Fit | Not Ready | Switch Careers",
  "actionPlan": ["step 1 to improve", "step 2", "step 3"]
}`;
    return await generateJSON(prompt);
  } catch {
    return {
      verdictText: 'The analysis is complete. Your readiness has been calculated.',
      quote: 'The chemistry does not lie.',
      fitRank: score >= 75 ? 'Strong Fit' : score >= 50 ? 'Partial Fit' : 'Not Ready',
      actionPlan: ['Build more projects in required skills', 'Add descriptions to all repos', 'Contribute to open source']
    };
  }
}

module.exports = { extractSkillsFromJD, matchSkillsToGitHub, calculateReadiness, generateJobVerdict };
