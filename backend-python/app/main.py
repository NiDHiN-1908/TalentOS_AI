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

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "online",
        "engine": "Python FastAPI + LangGraph Engine",
        "version": "1.0.0"
    }

@app.post(f"{settings.API_V1_STR}/orchestrate", response_model=AgentResponse)
def orchestrate_agent_prompt(req: AgentRequest):
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")
    
    tenant_id = req.tenant_id or settings.DEFAULT_TENANT_ID
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
