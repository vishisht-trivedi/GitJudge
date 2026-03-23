#!/bin/bash
cd /home/visi/linux_entry/GitJudge

echo "=== Pushing to GitHub ==="
echo ""
echo "When prompted:"
echo "  Username: vishisht-trivedi"
echo "  Password: [paste your GitHub Personal Access Token]"
echo ""
echo "Get token from: https://github.com/settings/tokens"
echo "Required scopes: repo, workflow"
echo ""

git push origin main
