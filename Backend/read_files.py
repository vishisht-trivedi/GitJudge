import subprocess

files = [
    '/home/visi/linux_entry/GitJudge/Backend/utils/recruiter.js',
    '/home/visi/linux_entry/GitJudge/Backend/utils/jobfit.js',
    '/home/visi/linux_entry/GitJudge/Backend/server.js',
]

for f in files:
    print(f'\n\n===== {f} =====')
    result = subprocess.run(['cat', f], capture_output=True, text=True)
    if result.returncode == 0:
        print(result.stdout)
    else:
        print('NOT FOUND:', result.stderr)
