const { generateJSON } = require('./ai');

const COOK_RANKS = [
  { name: 'Heisenberg',    min: 90, color: '#F5C518' },
  { name: 'Cartel Boss',   min: 75, color: '#E67E22' },
  { name: 'Blue Sky Cook', min: 60, color: '#62A854' },
  { name: 'Street Dealer', min: 45, color: '#8BC34A' },
  { name: 'Jesse Pinkman', min: 30, color: '#6B9BD2' },
  { name: "Saul's Client", min: 0,  color: '#C0392B' }
];

function getCookRank(score) {
  return COOK_RANKS.find(r => score >= r.min) || COOK_RANKS[COOK_RANKS.length - 1];
}

function computeChemistryScore(stats) {
  const { ownRepos, totalRepos, totalStars, topLanguages, descriptionCoverageRatio, topStars, followers, accountAgeYears } = stats;
  const ownRatio = totalRepos > 0 ? ownRepos / totalRepos : 0;
  const safeFollowers = Number(followers) || 0;

  const commitPurity    = Math.min(100, ownRatio * 50 + Math.min(50, totalStars / 2));
  const languageMastery = Math.min(100, topLanguages.length * 18);
  const repoQuality     = Math.min(100, descriptionCoverageRatio * 60 + Math.min(40, topStars * 2));
  const communityRep    = Math.min(100, Math.log10(safeFollowers + 1) * 40);
  const langDiversity   = Math.min(33, topLanguages.length * 6);
  const ageFactor       = Math.min(33, accountAgeYears * 5);
  const starCeiling     = Math.min(34, totalStars / 10);
  const heisenbergFactor = langDiversity + ageFactor + starCeiling;

  const overall = Math.round(
    commitPurity * 0.25 +
    languageMastery * 0.20 +
    repoQuality * 0.25 +
    communityRep * 0.15 +
    heisenbergFactor * 0.15
  );

  return {
    chemistryScore: overall,
    stats: {
      commitPurity: Math.round(commitPurity),
      languageMastery: Math.round(languageMastery),
      repoQuality: Math.round(repoQuality),
      communityRep: Math.round(communityRep),
      heisenbergFactor: Math.round(heisenbergFactor)
    }
  };
}

const FALLBACK_ROAST = {
  roastText: "You have a GitHub account. That's... something. Walter White would say you're not even worth the chemicals it would take to analyze your code. But here we are.",
  quote: "I am the one who codes. You are not.",
  tags: ["README Ghost", "Fork Collector", "Silent Chemist"],
  verdict: "ADEQUATE"
};

async function generateRoast(username, githubSummary) {
  try {
    const { stats, githubData } = githubSummary;
    const prompt = `You are Heisenberg (Walter White from Breaking Bad) analyzing a GitHub profile.
You speak with Walter's signature cold precision, dark humor, and chemistry metaphors.
Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text.

GitHub Profile:
- Username: ${username}
- Repos: ${stats.totalRepos} total, ${stats.ownRepos} own, ${stats.forkedCount} forked
- Stars earned: ${stats.totalStars}
- Top languages: ${stats.topLanguages.join(', ') || 'none'}
- Followers: ${githubData.followers}
- Account age: ${stats.accountAgeYears} years
- Repos without description: ${stats.noDescriptionCount}

Return this exact JSON:
{
  "roastText": "3-4 sentence Walter White style roast. Use chemistry metaphors.",
  "quote": "One memorable BB-style quote under 15 words",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "verdict": "GUILTY | PROMISING | LEGENDARY | DISAPPOINTING | ADEQUATE"
}

Tags to use: README Ghost, Fork Collector, Star Hoarder, Silent Chemist, Blue Sky Coder, Lone Wolf, Serial Forker, Commit Phantom, Language Polyglot`;

    return await generateJSON(prompt, `roast:${username}`);
  } catch (err) {
    console.error('Gemini roast error:', err.message);
    return FALLBACK_ROAST;
  }
}

async function generateBattleVerdict(user1, user2) {
  try {
    const prompt = `You are Walter White (Heisenberg) judging a GitHub developer cook-off.
Respond ONLY with valid JSON, no markdown, no code fences.

Developer 1: ${user1.username} — Score: ${user1.chemistryScore}, Rank: ${user1.cookRank}
Developer 2: ${user2.username} — Score: ${user2.chemistryScore}, Rank: ${user2.cookRank}

Return this exact JSON:
{
  "winner": "username of winner",
  "verdict": "2-3 sentence Walter White battle verdict using chemistry metaphors",
  "quote": "One short memorable quote under 15 words"
}`;

    return await generateJSON(prompt);
  } catch (err) {
    console.error('Gemini battle error:', err.message);
    const winner = user1.chemistryScore >= user2.chemistryScore ? user1.username : user2.username;
    return { winner, verdict: "The chemistry doesn't lie. One product is clearly superior.", quote: "Say my name." };
  }
}

module.exports = { computeChemistryScore, getCookRank, generateRoast, generateBattleVerdict, COOK_RANKS };
