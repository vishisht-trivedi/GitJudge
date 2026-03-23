require('dotenv').config();
const { getUserProfile, getUserRepos } = require('./utils/github');
const { parseResumeWithAI } = require('./utils/resumeParser');
const { crossReference, calcMatchScore, generateGapVerdict } = require('./utils/resumeGap');

async function test() {
  const username = 'vishisht-trivedi';

  console.log('1. Fetching GitHub data...');
  try {
    const [profile, repos] = await Promise.all([
      getUserProfile(username),
      getUserRepos(username),
    ]);
    console.log('   profile.login:', profile.login);
    console.log('   profile.created_at:', profile.created_at);
    console.log('   repos count:', repos.length);

    const githubData = {
      top_languages: (() => {
        const map = {};
        repos.forEach(r => { if (r.language) map[r.language] = (map[r.language] || 0) + 1; });
        return Object.entries(map).sort((a,b) => b[1]-a[1]).slice(0,10).map(([l]) => l);
      })(),
      repos,
      created_at: profile.created_at,
    };
    console.log('   top_languages:', githubData.top_languages);

    console.log('2. Testing parseResumeWithAI with fake text...');
    const fakeResume = `
      Skills: JavaScript, React, Node.js, Python, MongoDB
      Projects: GitJudge - A GitHub analyzer tool
      Experience: 2 years JavaScript development
      Education: B.Tech Computer Science
    `;
    const parsed = await parseResumeWithAI(fakeResume);
    console.log('   parsed skills:', parsed.skills);
    console.log('   parsed projects:', parsed.projects?.length, 'projects');
    console.log('   parsed experience:', parsed.experienceClaims?.length, 'claims');

    console.log('3. Cross-referencing...');
    const results = crossReference(parsed, githubData);
    console.log('   results count:', results.length);
    results.forEach(r => console.log(`   [${r.status}] ${r.type}: ${r.claim}`));

    console.log('4. Score:', calcMatchScore(results));

    console.log('5. Generating verdict...');
    const verdict = await generateGapVerdict(username, calcMatchScore(results), results);
    console.log('   matchGrade:', verdict.matchGrade);
    console.log('   quote:', verdict.quote);

    console.log('\nALL TESTS PASSED');
  } catch (err) {
    console.error('FAILED:', err.message);
    console.error(err.stack);
  }
}

test();
