import subprocess
result = subprocess.run(['cat', '/home/visi/linux_entry/GitJudge/Backend/utils/recruiter.js'], capture_output=True, text=True)
print(result.stdout)
