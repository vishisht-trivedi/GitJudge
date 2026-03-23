import shutil, os

BASE_WIN = r'\\wsl.localhost\Ubuntu-22.04\home\visi\linux_entry\GitJudge'
BASE_WSL = '/home/visi/linux_entry/GitJudge'

files = [
    'Backend/utils/ai.js',
    'Backend/utils/claude.js',
    'Backend/utils/recruiter.js',
    'Backend/utils/jobfit.js',
    'Backend/utils/resumeParser.js',
    'Backend/utils/resumeGap.js',
    'Backend/routes/resumeroast.js',
]

import subprocess

for f in files:
    win_src = os.path.join(BASE_WIN, f.replace('/', os.sep))
    wsl_dst = f'{BASE_WSL}/{f}'
    # Use cp via wsl
    result = subprocess.run(
        ['wsl', 'cp', win_src.replace('\\\\wsl.localhost\\Ubuntu-22.04', '').replace('\\', '/'), wsl_dst],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f'OK: {f}')
    else:
        print(f'ERR: {f} — {result.stderr}')
