@echo off
echo Initializing Git and Pushing to https://github.com/NiDHiN-1908/TalentOS_AI ...
git init
git remote remove origin 2>nul
git remote add origin https://github.com/NiDHiN-1908/TalentOS_AI.git
git branch -M main
git add .
git commit -m "feat(enterprise): complete ASP.NET Core .NET 9 hybrid architecture, AI recruitment exchange platform (13 free channels V1), connector marketplace SDK, 11-stage AI lifecycle, and 10-tier agent taxonomy"
git push -u origin main --force
echo Git commit and push completed successfully!
