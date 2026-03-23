#!/usr/bin/env python3

# Read current CSS
with open('/home/visi/linux_entry/GitJudge/Frontend/src/index.css', 'r') as f:
    css = f.read()

# Fix: Add proper z-index to ticker to ensure it stays below navbar content
css = css.replace(
    '.bb-ticker {\n  background: rgba(0, 0, 0, 0.6);\n  border-top: 1px solid rgba(74, 124, 63, 0.2);\n  border-bottom: 1px solid rgba(74, 124, 63, 0.2);\n  padding: 0.5rem 0;\n  overflow: hidden;\n  position: relative;\n}',
    '''.bb-ticker {
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(74, 124, 63, 0.2);
  border-bottom: 1px solid rgba(74, 124, 63, 0.2);
  padding: 0.5rem 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
  white-space: nowrap;
}'''
)

# Ensure ticker inner has proper width
css = css.replace(
    '.bb-ticker-inner {\n  display: flex;\n  gap: 2rem;\n  animation: ticker 60s linear infinite;\n  font-size: 0.85rem;\n  color: rgba(255, 255, 255, 0.6);\n  font-family: var(--font-mono);\n}',
    '''.bb-ticker-inner {
  display: flex;
  gap: 2rem;
  animation: ticker 60s linear infinite;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: var(--font-mono);
  white-space: nowrap;
  will-change: transform;
}'''
)

# Write fixed CSS
with open('/home/visi/linux_entry/GitJudge/Frontend/src/index.css', 'w') as f:
    f.write(css)

print('✓ Fixed ticker CSS')
