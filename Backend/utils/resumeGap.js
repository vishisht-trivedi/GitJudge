const { generateJSON } = require('./ai');

/**
 * Cross-reference resume claims against actual GitHub data.
 * Returns array of verified/partial/unverified claim results.
 */
function crossReference(claims, githubData) {
  const { top_languages = [], repos = [] } = githubData;
  const allLangs = top_languages.map(l => l.toLowerCase());
  const repoTopics = repos.flatMap(r => r.topics || []);
  const repoNames = repos.map(r => (r.name || '').toLowerCase());
  const descriptions = repos.map(r => (r.description || '').toLowerCase()).join(' ');
  const allText = [...repoNames, ...repoTopics, descriptions].join(' ');

  return claims.map(c => {
    const s = (c.skill || c.claim || '').toLowerCase();
    const inLangs = allLangs.some(l => l.includes(s) || s.includes(l));
    const inText = allText.includes(s);
    const signals = [inLangs, inText].filter(Boolean).length;

    let evidence = '';
    if (inLangs) evidence += `Found in GitHub languages. `;
    if (inText) evidence += `Found in repo names/descriptions. `;
    if (!evidence) evidence = 'No GitHub evidence found.';

    return {
      claim: c.claim,
      skill: c.skill,
      category: c.category,
      status: signals >= 2 ? 'verified' : signals === 1 ? 'partial' : 'unverified',
      evidence: evidence.trim()
    };
  });
}

/**
 * Calculate overall match score from cross-reference results.
 */
function calcMatchScore(crossRefResults) {
  if (!crossRefResults.length) return 0;
  const score = crossRefResults.reduce((sum, r) => {
    if (r.status === 'verified') return sum + 1;
    if (r.status === 'partial') return sum + 0.5;
    return sum;
  }, 0);
  return Math.round((score / crossRefResults.length) * 100);
}

/**
 * Generate Walter White's fraud verdict on the resume.
 */
async function generateGapVerdict(username, matchScore, crossRefResults, resumeName) {
  try {
    const verified = crossRefResults.filter(r => r.status === 'verified').map(r => r.skill);
    const unverified = crossRefResults.filter(r => r.status === 'unverified').map(r => r.skill);

    const prompt = `You are Walter White (Heisenberg) reviewing a resume against a GitHub profile.
You are looking for fraud — claims that cannot be backed up by actual code.
Match score: ${matchScore}%
Verified claims: ${verified.join(', ') || 'none'}
Unverified claims: ${unverified.join(', ') || 'none'}
Candidate: ${resumeName || username}
GitHub: ${username}

Return ONLY valid JSON:
{
  "fraudScore": number 0-100 (100 = total fraud, 0 = completely honest),
  "verdict": "FRAUDULENT | SUSPICIOUS | PARTIAL | HONEST | EXEMPLARY",
  "walterQuote": "One brutal Walter White line about this resume. Under 20 words.",
  "roastText": "3-4 sentences. Cold, precise. Call out specific unverified claims if any.",
  "actionPlan": ["specific fix 1", "specific fix 2", "specific fix 3"]
}`;

    return await generateJSON(prompt, `gap:${username}:${matchScore}`);
  } catch {
    const fraudScore = Math.max(0, 100 - matchScore);
    return {
      fraudScore,
      verdict: matchScore >= 70 ? 'HONEST' : matchScore >= 40 ? 'SUSPICIOUS' : 'FRAUDULENT',
      walterQuote: 'I have done the analysis. The numbers do not lie.',
      roastText: 'Your resume claims have been cross-referenced against your GitHub. The chemistry does not add up.',
      actionPlan: ['Build projects that demonstrate your claimed skills', 'Add descriptions to all repos', 'Make your GitHub public and active']
    };
  }
}

module.exports = { crossReference, calcMatchScore, generateGapVerdict };
