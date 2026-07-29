@echo off
echo Initializing Git and Pushing to https://github.com/NiDHiN-1908/TalentOS_AI ...
git init
git remote remove origin 2>nul
git remote add origin https://github.com/NiDHiN-1908/TalentOS_AI.git
git branch -M main
git add .
git commit -m "feat: Enterprise Production Deployment Platform - Automated Smoke Validator, Argo Rollouts Canary & DR Failover Runbook"
git push -u origin main
echo Git commit and push completed successfully!
pause
