# TalentOS AI — Agentic Human Resource Operating System

![Architecture](https://img.shields.io/badge/Architecture-Hybrid%20.NET%209%20%2B%20Python-2563EB)
![AI Engine](https://img.shields.io/badge/AI%20Engine-LangGraph%20Multi--Agent-7C3AED)
![Recruitment Exchange](https://img.shields.io/badge/Recruitment-Free--First%20Platform-ec4899)
![Status](https://img.shields.io/badge/Status-Actively%20in%20Development-06B6D4)

**TalentOS AI** is an **Agentic Human Resource Operating System** being built on a hybrid architecture: **ASP.NET Core (.NET 9)** as the enterprise business platform, and **Python 3.11** as a dedicated AI reasoning platform.

> **Project status:** actively in development, not yet deployed to production. The architecture below reflects the current design and build-in-progress — treat feature lists as the target scope, not a completed feature checklist.

---

## 🏛️ Hybrid Enterprise Architecture

```
                                  Client Request
                                        │
                                        ▼
                   ┌──────────────────────────────────────────┐
                   │  ASP.NET Core (.NET 9) YARP Gateway      │  (Port 5000)
                   └────────────────────┬─────────────────────┘
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
┌──────────────────────────┐                             ┌──────────────────────────┐
│  ASP.NET Core (.NET 9)   │                             │  Python 3.11 Dedicated   │
│  Enterprise Platform     │                             │  AI Platform (FastAPI)   │
├──────────────────────────┤                             ├──────────────────────────┤
│ • Auth / Identity        │                             │ • LangGraph Supervisor   │
│ • RBAC / ABAC Security   │  ◄──── DotNetBusClient ──── │ • Resume OCR Intelligence│
│ • Employee SSOT & Org    │    (Consumes .NET 9 APIs)   │ • Vector HNSW RAG        │
│ • Payroll & Business     │                             │ • Sub-Agent Reasoning    │
│ • Transactions & Audit   │                             │ • AI Explainability      │
└──────────────────────────┘                             └──────────────────────────┘
```

- **ASP.NET Core (.NET 9) Enterprise Business Platform:** owns authentication, authorization, tenant isolation, employee records, payroll calculations, business rules, transactional integrity, audit trails, and background jobs.
- **Python 3.11 Dedicated AI Platform:** owns multi-agent reasoning (LangGraph Supervisor), vector similarity scoring, resume parsing, RAG retrieval, and prompt optimization.
- **Strict boundary rule:** Python AI agents never mutate business state or access business database tables directly. Every AI action invokes ASP.NET Core (.NET 9) REST endpoints via `DotNetEnterpriseBusClient` — this is the core design decision the whole system is built around.

---

## 🌐 AI Recruitment Exchange Platform (Free-First Architecture)

Recruitment in TalentOS AI is designed as an AI-supervised exchange engine, where AI handles operational work and recruiters retain high-level supervision.

### Planned V1 Core Channels (Zero Paid API Dependency)

1. **Company Career Portal** — self-service responsive portal with candidate tracking
2. **Google Jobs SEO** — automated `Schema.org/JobPosting` JSON-LD structured data generator
3. **Employee Referral Portal** — referral link submitter and rewards ledger
4. **Internal Talent Pool** — rediscovery of past applicants
5. **University Portal** — student candidate intake & GPA matcher
6. **Campus Recruitment** — campaign manager
7. **Email Applications** — background mailbox scanner
8. **Google Forms Import** — response webhook field mapper
9. **CSV / Excel Import** — bulk candidate batch parsers
10. **Manual Entry** — recruiter candidate creation form
11. **Drag & Drop Resume Upload** — PDF, DOCX, TXT support
12. **QR Code Recruitment** — campaign QR generator

### Connector Marketplace (Future Scope)

Extensible `IConnectorPlugin` SDK and `ConnectorRegistry`, designed for future integrations — not yet built:

- **Job Boards:** LinkedIn Recruiter, Indeed, Naukri.com, Foundit
- **Enterprise ERPs:** Workday HCM, SAP SuccessFactors, Oracle HCM Cloud
- **ATS Systems:** Greenhouse, Lever, Workable

---

## 🔄 AI Action Lifecycle (Design)

```
[1. User Request] ➔ [2. Supervisor Agent] ➔ [3. Planning] ➔ [4. Task Decomposition]
    ➔ [5. Agent Collaboration] ➔ [6. ASP.NET Core (.NET 9)] ➔ [7. Workflow Engine]
    ➔ [8. Approvals] ➔ [9. Execution] ➔ [10. Monitoring] ➔ [11. Continuous Learning]
```

Every AI command is designed to follow this trace — connecting natural language prompts to .NET 9 business services, with human-in-the-loop approval checkpoints and monitoring.

---

## 📊 Agent Hierarchy Taxonomy

This is the **architectural taxonomy guiding development** — a mapped-out structure of agent roles across the platform, built incrementally rather than all at once:

- **Orchestration (Brain):** Supervisor Agent, Planner Agent, Memory Agent, Workflow Orchestrator, Policy Engine, Approval Coordinator, Audit Agent
- **Recruitment Exchange:** Job Publishing, Resume Intelligence, Screening Classifier, Ranking Vector Engine, Duplicate Detector, Interview Scheduler, Offer Generator
- **Employee Lifecycle:** Onboarding, Profile SSOT, Attendance, Leave, Payroll, Benefits, Performance, Promotion, Exit Management
- **Learning & Skills:** LMS Learning, Skills Matrix, Certification, Career Mobility, Training Recommendations
- **HR Operations:** Policy RAG, Compliance, Document OCR, Asset Allocation, Helpdesk Ticketing
- **Executive Intelligence:** Executive Briefing, Workforce Analytics, Attrition Scorer, Hiring Forecast
- **Integrations:** Email, Calendar, Google Workspace, Microsoft 365, Career Portal, Connector Marketplace
- **AI Platform:** RAG Retrieval, Knowledge Base, Vector Search, Embedding Generator, Model Router
- **Infrastructure:** Monitoring, Security, DevOps, Backup & Disaster Recovery
- **Future ERP Expansion:** Finance, Procurement, CRM, ERP, Legal, Operations

*(This is a design taxonomy, not a count of currently-implemented agents — categories are being built out incrementally.)*

---

## 📁 Repository Structure

```
TalentOS AI/
├── backend-dotnet/            # ASP.NET Core (.NET 9) Enterprise Business Platform
│   ├── src/
│   │   ├── TalentOS.Gateway/           # .NET 9 YARP API Reverse Proxy Gateway (Port 5000)
│   │   ├── TalentOS.IdentityService/   # Auth, Keycloak JWT, ABAC Policies (Port 5001)
│   │   ├── TalentOS.EmployeeService/   # Employee SSOT & Department Hierarchy (Port 5002)
│   │   ├── TalentOS.RecruitmentService/# Job Requisitions & Candidate Pipelines (Port 5003)
│   │   ├── TalentOS.PayrollService/    # Gross-to-Net & Pre-Payroll Audits (Port 5004)
│   │   ├── TalentOS.OperationsService/ # Attendance, Leave & Operations (Port 5005)
│   │   └── TalentOS.Shared/            # Domain-Driven Design (DDD) Shared Kernel
│   └── Dockerfile                      # Multi-stage .NET 9 Docker builder
├── backend-python/            # Python 3.11 Dedicated AI Platform Microservice
│   ├── app/
│   │   ├── agents/                     # LangGraph Multi-Agent Supervisor & Nodes
│   │   ├── core/                       # DotNetEnterpriseBusClient & Security
│   │   └── api/                        # AI Service Endpoints
│   └── tests/                          # PyTest Suite
├── src/                       # React + TypeScript Frontend
│   ├── application/services/           # FreeChannelsService, ConnectorMarketplaceService
│   ├── domain/                         # Domain Models, Types & Event Definitions
│   └── presentation/views/             # RecruitmentView, AgentOrchestratorView
├── .github/workflows/         # CI/CD Pipeline (Build, Pytest, Vitest)
└── git_push.bat               # Automation script for GitHub sync
```

---

## 🚀 Quick Start Guide

### Prerequisites

- **Node.js**: v18+
- **.NET SDK**: v9.0+
- **Python**: 3.11+
- **PostgreSQL**: 16+ (with `pgvector` extension)

### 1. Launch ASP.NET Core (.NET 9) Gateway & Microservices

```bash
cd backend-dotnet
dotnet restore TalentOS.sln
dotnet run --project src/TalentOS.Gateway/TalentOS.Gateway.csproj
```

Gateway active at `http://localhost:5000`.

### 2. Launch Python AI Engine

```bash
cd backend-python
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

AI Engine active at `http://localhost:8000`.

### 3. Launch Frontend

```bash
npm install
npm run dev
```

Access UI at `http://localhost:5173`.

---

## Roadmap

- [ ] Stabilize core service boundaries between .NET and Python platforms
- [ ] Complete recruitment pipeline: intake channels, vector-based candidate ranking
- [ ] Agent-orchestration view in the frontend
- [ ] Deploy a live demo environment
- [ ] Expand agent taxonomy categories incrementally, starting with Recruitment Exchange

---

*Built by [Nidhin S](https://github.com/NiDHiN-1908) — [Portfolio](https://nidhin-1908.github.io/) · [LinkedIn](https://www.linkedin.com/in/nidhin-s-ai/)*
