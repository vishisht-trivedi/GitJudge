require('dotenv').config();
try { require('./routes/analyze');     console.log('analyze      OK'); } catch(e) { console.error('analyze      FAIL:', e.message); }
try { require('./routes/battle');      console.log('battle       OK'); } catch(e) { console.error('battle       FAIL:', e.message); }
try { require('./routes/leaderboard'); console.log('leaderboard  OK'); } catch(e) { console.error('leaderboard  FAIL:', e.message); }
try { require('./routes/recruiter');   console.log('recruiter    OK'); } catch(e) { console.error('recruiter    FAIL:', e.message); }
try { require('./routes/jobfit');      console.log('jobfit       OK'); } catch(e) { console.error('jobfit       FAIL:', e.message); }
try { require('./routes/resumeroast'); console.log('resumeroast  OK'); } catch(e) { console.error('resumeroast  FAIL:', e.message); }
console.log('All routes checked.');
