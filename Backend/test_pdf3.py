import subprocess

script = """
const pdfParse = require('pdf-parse');
console.log('type:', typeof pdfParse);
// Should be a function now
"""

with open('/home/visi/linux_entry/GitJudge/Backend/test_pdf3.js', 'w') as f:
    f.write(script)

r = subprocess.run(['node', 'test_pdf3.js'], capture_output=True, text=True,
    cwd='/home/visi/linux_entry/GitJudge/Backend')
print(r.stdout.strip())
print(r.stderr[:200] if r.stderr else '')
