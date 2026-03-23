const axios = require('axios');

const headers = () => ({
  'User-Agent': 'GitJudge-App',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {})
});

async function getUserProfile(username) {
  const res = await axios.get(`https://api.github.com/users/${username}`, { headers: headers() });
  return res.data;
}

async function getUserRepos(username) {
  try {
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=100`,
      { headers: headers() }
    );
    return res.data;
  } catch {
    return [];
  }
}

function transformGithubData(profile, repos) {
  const ownRepos = repos.filter(r => !r.fork);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const langMap = {};
  repos.forEach(r => { if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1; });
  const topLanguages = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);
  const mostStarred = repos.sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
  const noDescCount = ownRepos.filter(r => !r.description).length;
  const accountAgeYears = ((Date.now() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  return {
    githubData: {
      name: profile.name || profile.login,
      bio: profile.bio || '',
      avatar_url: profile.avatar_url,
      public_repos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      created_at: profile.created_at,
      location: profile.location || '',
      company: profile.company || '',
      total_stars: totalStars,
      top_languages: topLanguages,
      most_starred_repo: mostStarred?.name || ''
    },
    stats: {
      totalRepos: repos.length,
      ownRepos: ownRepos.length,
      forkedCount: repos.length - ownRepos.length,
      totalStars,
      topLanguages,
      accountAgeYears: parseFloat(accountAgeYears),
      noDescriptionCount: noDescCount,
      topStars: mostStarred?.stargazers_count || 0,
      descriptionCoverageRatio: ownRepos.length > 0 ? (ownRepos.filter(r => r.description).length / ownRepos.length) : 0,
      followers: profile.followers || 0
    }
  };
}

module.exports = { getUserProfile, getUserRepos, transformGithubData };
