@echo off
echo =========================================================
echo TalentOS AI Enterprise Platform Launcher
echo =========================================================
echo.

echo Checking local environment prerequisites...
where dotnet >nul 2>nul
if %errorlevel% neq 0 (
    echo [NOTICE] .NET SDK was not detected on local PATH.
    echo Platform will run in Standalone Mode using Python AI Engine + React Frontend.
    echo (To enable full ASP.NET Core .NET 9 microservices, install .NET 9 SDK from https://dotnet.microsoft.com/download/dotnet/9.0)
    echo.
    start "TalentOS Frontend (Vite)" cmd /k "npm run dev"
    start "TalentOS Python AI Platform (FastAPI)" cmd /k "cd backend-python && uvicorn app.main:app --reload --port 8000"
) else (
    echo [.NET SDK Detected] Launching Full Enterprise Hybrid Architecture...
    start "TalentOS Frontend (Vite)" cmd /k "npm run dev"
    start "TalentOS ASP.NET Core Gateway (.NET 9)" cmd /k "cd backend-dotnet && dotnet run --project src/TalentOS.Gateway/TalentOS.Gateway.csproj"
    start "TalentOS Python AI Platform (FastAPI)" cmd /k "cd backend-python && uvicorn app.main:app --reload --port 8000"
)

echo.
echo Launch sequence initiated!
echo - Web Application: http://localhost:5173
echo - Python AI Engine Docs: http://localhost:8000/docs
echo.
pause
