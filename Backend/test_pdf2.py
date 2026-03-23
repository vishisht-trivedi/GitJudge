import subprocess

script = """
require('dotenv').config();
const { PDFParse } = require('pdf-parse');

async function test() {
  // Create a minimal valid PDF in memory to test
  // Just test the API shape
  const parser = new PDFParse();
  console.log('PDFParse instance created OK');
  console.log('methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));
}
test().catch(e => console.log('ERR:', e.message));
"""

with open('/home/visi/linux_entry/GitJudge/Backend/test_pdf2.js', 'w') as f:
    f.write(script)

r = subprocess.run(['node', 'test_pdf2.js'], capture_output=True, text=True,
    cwd='/home/visi/linux_entry/GitJudge/Backend')
print(r.stdout)
print(r.stderr[:300] if r.stderr else '')
