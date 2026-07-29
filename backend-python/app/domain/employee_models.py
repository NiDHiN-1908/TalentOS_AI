from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class EmploymentStatusEnum(str, Enum):
    PROBATION = "PROBATION"
    CONFIRMED = "CONFIRMED"
    PROMOTED = "PROMOTED"
    TRANSFERRED = "TRANSFERRED"
    SUSPENDED = "SUSPENDED"
    TERMINATED = "TERMINATED"
    REHIRED = "REHIRED"

class EmployeeProfileCreate(BaseModel):
    first_name: str = Field(..., example="Sarah")
    last_name: str = Field(..., example="Chen")
    email: EmailStr = Field(..., example="sarah.chen@talentos.ai")
    phone: str = Field(..., example="+14155552671")
    job_title: str = Field(..., example="Principal AI Architect")
    department_name: str = Field(..., example="Engineering")
    manager_id: Optional[str] = Field(default="EMP-100")
    joining_date: str = Field(..., example="2026-08-15")
    ssn_tax_id_masked: str = Field(default="***-**-6789")
    base_salary_reference: float = Field(..., example=210000)
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class EmployeeMasterRecord(BaseModel):
    employee_id: str
    first_name: str
    last_name: str
    full_name: str
    email: EmailStr
    job_title: str
    department_name: str
    manager_id: Optional[str]
    status: EmploymentStatusEnum
    joining_date: str
    ssn_tax_id: str  # Masked for security
    skills: List[str] = Field(default_factory=list)
    created_at: str

class OrgChartNode(BaseModel):
    employee_id: str
    name: str
    title: str
    department: str
    direct_reports: List["OrgChartNode"] = Field(default_factory=list)

class LifecycleEventRecord(BaseModel):
    event_id: str
    employee_id: str
    event_type: str = Field(..., example="PROMOTION")
    previous_title: str
    new_title: str
    effective_date: str
    reason: str

class AISuccessorshipRecommendation(BaseModel):
    position_title: str
    target_successor_id: str
    candidate_name: str
    readiness_score_pct: float = Field(..., example=94.5)
    readiness_timeline: str = Field(default="Ready Now")
    skill_gaps: List[str]
