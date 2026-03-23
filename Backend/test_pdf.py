import subprocess

script = """
require('dotenv').config();
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Create a minimal test PDF buffer to test the API
// pdf-parse v2 changed its API
console.log('pdf-parse version:', require('./node_modules/pdf-parse/package.json').version);
console.log('pdf-parse type:', typeof pdfParse);
console.log('pdf-parse keys:', Object.keys(pdfParse));

// Check if it's a default export issue
const pp = require('pdf-parse');
console.log('default:', typeof pp.default);
"""

with open('/home/visi/linux_entry/GitJudge/Backend/test_pdf_api.js', 'w') as f:
    f.write(script)

r = subprocess.run(['node', 'test_pdf_api.js'], capture_output=True, text=True,
    cwd='/home/visi/linux_entry/GitJudge/Backend')
print(r.stdout)
print(r.stderr[:500] if r.stderr else '')
