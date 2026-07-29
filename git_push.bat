@echo off
echo Initializing Git and Pushing to https://github.com/NiDHiN-1908/TalentOS_AI ...
git init
git remote remove origin 2>nul
git remote add origin https://github.com/NiDHiN-1908/TalentOS_AI.git
git branch -M main
git add .
git commit -m "feat: Enterprise Employee Helpdesk Platform - Omnichannel Service Catalog, P1-P4 SLA Timers, Virtual AI Assistant & CSAT Surveys"
git push -u origin main
echo Git commit and push completed successfully!
pause
