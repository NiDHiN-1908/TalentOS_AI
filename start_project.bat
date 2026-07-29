@echo off
echo ==========================================================
echo Starting TalentOS AI Enterprise Ecosystem...
echo ==========================================================

echo Starting Python FastAPI Backend Server (Port 8000)...
start "TalentOS AI Backend" cmd /k "cd backend-python && set PYTHONPATH=. && python -m uvicorn app.main:app --reload --port 8000"

echo Starting Vite React Frontend Application (Port 5173)...
start "TalentOS AI Frontend" cmd /k "npm run dev"

echo ==========================================================
echo TalentOS AI Application Servers Launching:
echo Backend REST API: http://localhost:8000/docs
echo Frontend Web App: http://localhost:5173
echo ==========================================================
pause
