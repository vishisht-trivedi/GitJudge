import subprocess, os

os.chdir('/home/visi/linux_entry/GitJudge/Backend')

# Check if multer and pdf-parse are installed
result = subprocess.run(
    ['node', '-e', "require('multer'); require('pdf-parse'); require('./utils/ai'); require('./utils/resumeParser'); require('./utils/resumeGap'); require('./routes/resumeroast'); console.log('ALL IMPORTS OK')"],
    capture_output=True, text=True, cwd='/home/visi/linux_entry/GitJudge/Backend'
)
print('STDOUT:', result.stdout)
print('STDERR:', result.stderr)
print('CODE:', result.returncode)
