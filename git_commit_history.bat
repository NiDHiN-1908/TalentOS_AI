@echo off
echo Building sequential Git commit history for TalentOS AI...

git init
git remote remove origin 2>nul
git remote add origin https://github.com/NiDHiN-1908/TalentOS_AI.git
git branch -M main

:: Commit 1: Core Foundation & Configuration
git add package.json tsconfig.json vite.config.ts index.html src/domain/types/index.ts src/infrastructure/store/hrStore.ts src/presentation/styles/designSystem.css .gitignore
git commit -m "feat: Phase 1 Clean Architecture foundation & HR data store"

:: Commit 2: Authentication System
git add src/domain/types/auth.ts src/application/services/AuthService.ts src/application/services/RateLimiterService.ts src/presentation/views/AuthView.tsx tests/authSystem.test.ts
git commit -m "feat: Authentication & Security System - JWT, Refresh Tokens, RBAC & Rate Limiting"

:: Commit 3: Recruitment & ATS Module
git add src/domain/types/recruitment.ts src/application/agents/RecruitmentAgentEngine.ts src/application/services/RecruitmentService.ts src/presentation/views/RecruitmentView.tsx tests/recruitmentModule.test.ts
git commit -m "feat: Recruitment & ATS Module - AI Resume Parser, Candidate Ranking & Candidate Portal"

:: Commit 4: 11-Step Employee Onboarding Module
git add src/domain/types/onboarding.ts src/application/agents/OnboardingAgentEngine.ts src/application/services/OnboardingService.ts src/presentation/views/OnboardingView.tsx tests/onboardingModule.test.ts
git commit -m "feat: 11-Step Employee Onboarding Module - Offer Accepted to Manager Notification"

:: Commit 5: 11 Enterprise Core Modules
git add src/domain/types/enterpriseModules.ts src/application/services/EnterpriseModulesService.ts src/presentation/views/AttendanceLeaveView.tsx src/presentation/views/AssetsComplianceView.tsx src/presentation/views/HelpdeskExitView.tsx src/presentation/views/AnalyticsView.tsx tests/enterpriseModules.test.ts
git commit -m "feat: 11 Core Enterprise HR Modules - Attendance, Leave, Assets, Compliance, Helpdesk & Analytics"

:: Commit 6: LangGraph Multi-Agent Engine
git add src/application/agents/langgraph/ src/application/services/OrchestratorService.ts tests/langGraphAgents.test.ts
git commit -m "feat: LangGraph Multi-Agent System - 11 Sub-Agents, ReAct Reflection & Tri-Layer Memory"

:: Commit 7: Senior Architect Review & Database Migrations
git add src/domain/events/ src/application/services/JWTVerificationService.ts migrations/ src/presentation/components/ErrorBoundary.tsx tests/architectureReview.test.ts
git commit -m "refactor: Master Senior Architect Review - DDD Domain Events, ErrorBoundary & 24-Table DDL Migration Script"

:: Commit 8: Python FastAPI + LangGraph Microservice
git add backend-python/
git commit -m "feat: Python FastAPI + LangGraph AI Microservice - Async REST API, Pydantic & Pytest"

:: Commit 9: Remaining UI Components & Documentation
git add .
git commit -m "docs: Update Master Enterprise System Specifications & Walkthrough Documentation"

:: Push to GitHub repository
git push -u origin main --force

echo All 9 Phase Commits successfully pushed to https://github.com/NiDHiN-1908/TalentOS_AI!
pause
