#!/bin/bash
# GitJudge - Restore to Working Checkpoint
# Run this script to restore all Phase 3 changes

set -e

echo "🔧 GitJudge Checkpoint Restore"
echo "================================"

cd /home/visi/linux_entry/GitJudge

# 1. Install correct pdf-parse version
echo "📦 Installing pdf-parse@1.1.1..."
cd Backend
npm install pdf-parse@1.1.1 --save

# 2. Verify all dependencies
echo "✓ Verifying dependencies..."
npm install

# 3. Kill any process on port 5000
echo "🔪 Killing port 5000..."
fuser -k 5000/tcp 2>/dev/null || true
sleep 1

# 4. Test imports
echo "🧪 Testing imports..."
node -e "
  require('./utils/ai');
  require('./utils/claude');
  require('./utils/recruiter');
  require('./utils/jobfit');
  require('./utils/resumeParser');
  require('./utils/resumeGap');
  require('./routes/resumeroast');
  console.log('✓ All imports OK');
"

# 5. Build frontend
echo "🏗️  Building frontend..."
cd ../Frontend
npm install
npm run build

echo ""
echo "✅ CHECKPOINT RESTORED"
echo ""
echo "📋 Files created/modified:"
echo "  Backend/utils/ai.js - AI wrapper with fallback + cache"
echo "  Backend/utils/claude.js - Refactored to use ai.js"
echo "  Backend/utils/recruiter.js - Refactored to use ai.js"
echo "  Backend/utils/jobfit.js - Refactored to use ai.js"
echo "  Backend/utils/resu