import subprocess

files = [
    '/home/visi/linux_entry/GitJudge/Frontend/src/index.css',
    '/home/visi/linux_entry/GitJudge/Frontend/src/pages/Home.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/pages/Result.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/pages/Battle.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/pages/Leaderboard.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/pages/JobFit.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/Navbar.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/SmokyBackground.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/CircularScore.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/StatBar.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/CookRankBadge.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/ActionPlan.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/SkillsTable.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/RecruiterView.jsx',
    '/home/visi/linux_entry/GitJudge/Frontend/src/components/RadarChart.jsx',
]

for f in files:
    print(f'\n\n===FILE:{f}===')
    r = subprocess.run(['cat', f], capture_output=True, text=True)
    print(r.stdout if r.returncode == 0 else 'NOT FOUND: ' + r.stderr)
