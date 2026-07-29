@echo off
echo Initializing Git and Pushing to https://github.com/NiDHiN-1908/TalentOS_AI ...
git init
git remote remove origin 2>nul
git remote add origin https://github.com/NiDHiN-1908/TalentOS_AI.git
git branch -M main
git add .
git commit -m "feat: Enterprise Governance, Risk & Compliance (GRC) Platform - 5x5 Risk Matrix, SOC 2/ISO 27001 Controls & SHA-256 Audit Evidence"
git push -u origin main
echo Git commit and push completed successfully!
pause
