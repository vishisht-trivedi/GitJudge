require('dotenv').config();
const { getUserProfile, getUserRepos, transformGithubData } = require('./utils/github');
const { computeChemistryScore } = require('./utils/claude');

async function run() {
  const profile = await getUserProfile('torvalds');
  const repos = await getUserRepos('torvalds');
  const { githubData, stats } = transformGithubData(profile, repos);
  
  console.log('=== GITHUB DATA ===');
  console.log('followers:', profile.followers, typeof profile.followers);
  console.log('stats.followers (should not exist):', stats.followers);
  console.log('stats keys:', Object.keys(stats));
  console.log('stats:', JSON.stringify(stats, null, 2));
  
  console.log('\n=== SCORE ===');
  const score = computeChemistryScore(stats);
  console.log(JSON.stringify(score, null, 2));
}

run().catch(console.error);
