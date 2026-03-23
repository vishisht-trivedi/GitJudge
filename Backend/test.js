// Quick API test script
const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = http.request(options, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw.slice(0, 300) }); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: 'localhost', port: 5000, path }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw.slice(0, 300) }); }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('\n=== TEST 1: GET / ===');
  const root = await get('/');
  console.log(root.status, JSON.stringify(root.body));

  console.log('\n=== TEST 2: POST /api/analyze (torvalds) ===');
  const analyze = await post('/api/analyze', { username: 'torvalds' });
  console.log('Status:', analyze.status);
  if (analyze.body.verdict) {
    console.log('cookRank:', analyze.body.verdict.cookRank);
    console.log('chemistryScore:', analyze.body.verdict.chemistryScore);
    console.log('roastText:', analyze.body.verdict.roastText?.slice(0, 80));
    console.log('tags:', analyze.body.verdict.tags);
    console.log('fromCache:', analyze.body.fromCache);
  } else {
    console.log('ERROR:', JSON.stringify(analyze.body));
  }

  console.log('\n=== TEST 3: GET /api/leaderboard ===');
  const lb = await get('/api/leaderboard');
  console.log('Status:', lb.status, '| Count:', Array.isArray(lb.body) ? lb.body.length : 'not array');

  console.log('\n=== TEST 4: POST /api/battle ===');
  const battle = await post('/api/battle', { username1: 'torvalds', username2: 'gaearon' });
  console.log('Status:', battle.status);
  if (battle.body.battleVerdict) {
    console.log('winner:', battle.body.battleVerdict.winner);
    console.log('verdict:', battle.body.battleVerdict.verdict?.slice(0, 80));
  } else {
    console.log('ERROR:', JSON.stringify(battle.body).slice(0, 200));
  }

  console.log('\n=== ALL TESTS DONE ===');
}

run().catch(console.error);
