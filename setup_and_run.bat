@echo off
echo ==========================================================
echo TalentOS AI Enterprise Setup & Automated Dependency Installer
echo ==========================================================

echo [1/3] Installing Python Backend Dependencies...
cd backend-python
python -m pip install -r requirements.txt pytest
cd ..

echo [2/3] Installing Node.js Frontend Dependencies...
npm install

echo ==========================================================
echo [3/3] Launching TalentOS AI Application Servers...
echo ==========================================================

start "TalentOS AI Backend" cmd /k "cd backend-python && set PYTHONPATH=. && python -m uvicorn app.main:app --reload --port 8000"
start "TalentOS AI Frontend" cmd /k "npm run dev"

echo ==========================================================
echo TalentOS AI Application Servers Running:
echo Backend REST API: http://localhost:8000/docs
echo Frontend Web App: http://localhost:5173
echo ==========================================================
pause
