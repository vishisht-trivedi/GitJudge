import re

# Result.jsx
with open('/home/visi/linux_entry/GitJudge/Frontend/src/pages/Result.jsx', 'r') as f:
    content = f.read()
content = re.sub(r'return \(\s*<div className="container"', 'return (\n    <div className="page-enter container"', content, 1)
with open('/home/visi/linux_entry/GitJudge/Frontend/src/pages/Result.jsx', 'w') as f:
    f.write(content)
print('✓ Result.jsx')

# Battle.jsx
with open('/home/visi/linux_entry/GitJudge/Frontend/src/pages/Battle.jsx', 'r') as f:
    content = f.read()
content = re.sub(r'return \(\s*<div style={{ minHeight:', 'return (\n    <div className="page-enter" style={{ minHeight:', content, 1)
with open('/home/visi/linux_entry/GitJudge/Frontend/src/pages/Battle.jsx', 'w') as f:
    f.write(content)
print('✓ Battle.jsx')

# Leaderboard.jsx
with open('/home/visi/linux_entry/GitJudge/Frontend/src/pages/Leaderboard.jsx', 'r') as f:
    content = f.read()
content = re.sub(r'return \(\s*<div', 'return (\n    <div className="page-enter"', content, 1)
with open('/home/visi/linux_entry/GitJudge/Frontend/src/pages/Leaderboard.jsx', 'w') as f:
    f.write(content)
print('✓ Leaderboard.jsx')

print('✓ All pages updated with page-enter class')
