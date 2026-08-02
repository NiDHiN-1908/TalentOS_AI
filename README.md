# TalentOS AI — Agentic Human Resource Operating System

![TalentOS AI Platform](https://img.shields.io/badge/Architecture-Clean%20%2F%20DDD-10b981)
![Security](https://img.shields.io/badge/Security-Zero%20Trust%20%2F%20SOC2-6366f1)
![AI Engine](https://img.shields.io/badge/AI-LangGraph%20Multi--Agent-f59e0b)
![Version](https://img.shields.io/badge/Version-1.0.0--Production-06b6d4)

TalentOS AI is an autonomous, multi-tenant enterprise Human Resource Operating System powered by a LangGraph Supervisor AI agent core, PostgreSQL (with pgvector & RLS), and an enterprise design system inspired by Linear, Stripe, Vercel, and Workday.

---

## 🌟 Core Architecture & Capabilities

### 1. Enterprise Multi-Agent AI Core (LangGraph)
* **Supervisor Agent**: Decomposes natural language prompts into DAG execution graphs.
* **Domain Sub-Agents**: Specialized autonomous agents for Recruitment & ATS, Global Payroll Anomaly Detection, Onboarding Pipelines, Executive BI, and GRC Security verification.
* **StateGraph Context Memory**: In-memory and persistent contextual state retention per tenant workspace.

### 2. Role-Based Experience (RBX) & Zero Trust Security
* **Preset & Custom Personas**: `HR_MANAGER`, `RECRUITER`, `PAYROLL_MANAGER`, `EMPLOYEE`, `EXECUTIVE`, `PLATFORM_ADMIN`.
* **Dynamic RBX Guards (`RBXGuard.tsx`)**: Fine-grained module-level and action-level authorization gating.
* **Tenant Isolation Middleware**: Cryptographic JWT validation, header inspection, and automated 401 JSON error responses for untrusted requests.

### 3. Enterprise Design System & UX
* **Tokens & Aesthetics**: Midnight obsidian canvas, glassmorphic panels, Linear status badges, and high-density data tables (`designSystem.css`).
* **Dark / Light Theme Engine**: Seamless theme switching with instant CSS variable remapping.
* **Responsive Layouts**: Accessible keyboard shortcuts (`⌘K` Command Palette), global floating AI Copilot, and approval drawers.

---

## 📁 Repository Structure

```
TalentOS AI/
├── backend-python/            # FastAPI Python AI Microservice Backend
│   ├── app/
│   │   ├── agents/           # LangGraph Multi-Agent Supervisor & Domain Nodes
│   │   ├── api/              # 30+ Enterprise Module Routers
│   │   ├── core/             # Configuration, Zero-Trust Cryptography & Security
│   │   ├── domain/           # Pydantic Schemas & Data Models
│   │   └── middleware/       # Tenant Isolation & JWT Verification Middleware
│   └── tests/                # 31 Python PyTest Suites
├── src/                       # Clean Architecture React + TypeScript Frontend
│   ├── domain/               # Domain Models, RBAC & Event Definitions
│   ├── application/          # Service Layer, Custom Hooks & Store Contracts
│   ├── infrastructure/       # State Stores (authStore, hrStore)
│   └── presentation/         # Views, Components & Enterprise Design System
├── migrations/                # PostgreSQL Multi-Tenant Schema (24 Tables + pgvector)
├── deploy/                    # ArgoCD Rollouts & Production Health Validators
├── helm/                      # Kubernetes Helm Charts
├── terraform/                 # Infrastructure as Code Scripts
├── monitoring/                # Prometheus & Grafana Configuration
├── security/                  # OPA Security Policies
└── tests/                     # 11 Vitest / Jest Unit & Integration Test Suites
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js**: v18+ 
* **Python**: 3.10+
* **PostgreSQL**: 15+ (with `pgvector` extension)

### 1. Frontend Setup
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173`.

### 2. Backend Setup
```bash
cd backend-python
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation: `http://localhost:8000/docs`.

### 3. Running Test Suites
```bash
# Frontend Tests
npm test

# Python Backend Tests
pytest backend-python/tests
```

---

## 🛡️ Security & Compliance
* **SOC 2 Type II Compliance Scaffolding**
* **AES-256-GCM Field Encryption** for PII data fields.
* **Open Policy Agent (OPA)** fine-grained RBAC/ABAC authorization checks.
* **Prompt Injection Protection** and automatic PII redaction filters in AI output streams.
