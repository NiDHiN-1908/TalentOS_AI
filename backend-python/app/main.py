from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.domain.models import (
    AgentRequest, 
    AgentResponse, 
    ResumeParseRequest, 
    ResumeParseResponse, 
    PayrollAuditRequest, 
    PayrollAuditResponse, 
    AnomalyItem
)
from app.agents.langgraph_supervisor import PythonLangGraphSupervisor
from app.api.auth_routes import router as auth_router
from app.api.workflow_routes import router as workflow_router
from app.api.ai_routes import router as ai_router
from app.api.ai_core_routes import router as ai_core_router
from app.api.supervisor_routes import router as supervisor_router
from app.api.integration_routes import router as integration_router
from app.api.knowledge_routes import router as knowledge_router
from app.api.notification_routes import router as notification_router
from app.api.recruitment_routes import router as recruitment_router
from app.api.candidate_portal_routes import router as candidate_portal_router
from app.api.ats_routes import router as ats_router
from app.api.resume_routes import router as resume_router
from app.api.interview_routes import router as interview_router
from app.api.assessment_routes import router as assessment_router
from app.api.offer_routes import router as offer_router
from app.api.onboarding_routes import router as onboarding_router
from app.api.employee_routes import router as employee_router
from app.api.attendance_routes import router as attendance_router
from app.api.leave_routes import router as leave_router
from app.api.payroll_routes import router as payroll_router
from app.api.performance_routes import router as performance_router
from app.api.learning_routes import router as learning_router
from app.api.asset_routes import router as asset_router
from app.api.grc_routes import router as grc_router
from app.middleware.tenant_middleware import TenantIsolationMiddleware

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Middleware
app.add_middleware(TenantIsolationMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(workflow_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(ai_core_router, prefix=settings.API_V1_STR)
app.include_router(supervisor_router, prefix=settings.API_V1_STR)
app.include_router(integration_router, prefix=settings.API_V1_STR)
app.include_router(knowledge_router, prefix=settings.API_V1_STR)
app.include_router(notification_router, prefix=settings.API_V1_STR)
app.include_router(recruitment_router, prefix=settings.API_V1_STR)
app.include_router(candidate_portal_router, prefix=settings.API_V1_STR)
app.include_router(ats_router, prefix=settings.API_V1_STR)
app.include_router(resume_router, prefix=settings.API_V1_STR)
app.include_router(interview_router, prefix=settings.API_V1_STR)
app.include_router(assessment_router, prefix=settings.API_V1_STR)
app.include_router(offer_router, prefix=settings.API_V1_STR)
app.include_router(onboarding_router, prefix=settings.API_V1_STR)
app.include_router(employee_router, prefix=settings.API_V1_STR)
app.include_router(attendance_router, prefix=settings.API_V1_STR)
app.include_router(leave_router, prefix=settings.API_V1_STR)
app.include_router(payroll_router, prefix=settings.API_V1_STR)
app.include_router(performance_router, prefix=settings.API_V1_STR)
app.include_router(learning_router, prefix=settings.API_V1_STR)
app.include_router(asset_router, prefix=settings.API_V1_STR)
app.include_router(grc_router, prefix=settings.API_V1_STR)

@app.get("/health")
@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "online",
        "engine": "Python FastAPI + Identity + Workflow + AI Core + LangGraph Supervisor + Integrations + RAG + Notifications + Recruitment + Candidate Experience + ATS + Resume Intelligence + Interview Intelligence + Assessment Intelligence + Offer Intelligence + Employee Onboarding + Core Employee SSOT + Attendance + Leave + Global Payroll + Performance Management + Enterprise Learning + Enterprise Asset Management + Enterprise GRC Platform",
        "version": "1.0.0"
    }

@app.post(f"{settings.API_V1_STR}/orchestrate", response_model=AgentResponse)
def orchestrate_agent_prompt(req: AgentRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    
    tenant_id = req.tenant_id or "TNT-TALENTOS-01"
    return PythonLangGraphSupervisor.run_graph(req.prompt, tenant_id)

@app.post(f"{settings.API_V1_STR}/parse-resume", response_model=ResumeParseResponse)
def parse_candidate_resume(req: ResumeParseRequest):
    if not req.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")
    
    text = req.resume_text.lower()
    skills = []
    for s in ["pytorch", "tensorflow", "react", "typescript", "python", "go", "kubernetes", "aws", "docker"]:
        if s in text:
            skills.append(s.capitalize())
    
    if not skills:
        skills = ["AI Systems", "TypeScript", "System Architecture"]

    return ResumeParseResponse(
        candidate_id=req.candidate_id,
        experience_years=7,
        skills_extracted=skills,
        match_score=94,
        ai_recommendation="Strong Hire: Fast-track candidate for lead technical interview."
    )

@app.post(f"{settings.API_V1_STR}/audit-payroll", response_model=PayrollAuditResponse)
def audit_payroll_anomalies(req: PayrollAuditRequest):
    anomalies = [
        AnomalyItem(
            employee_id="EMP-103",
            employee_name="Elena Rostova",
            anomaly_type="Salary Spike",
            severity="High",
            description="Gross pay increased by +28% vs previous month due to unapproved bonus."
        ),
        AnomalyItem(
            employee_id="EMP-105",
            employee_name="Alex Rivera",
            anomaly_type="Tax ID Missing",
            severity="Medium",
            description="State tax identification number missing for recently relocated residence."
        )
    ]
    
    return PayrollAuditResponse(
        period=req.period,
        total_audited_count=42,
        anomalies_count=len(anomalies),
        anomalies=anomalies
    )
