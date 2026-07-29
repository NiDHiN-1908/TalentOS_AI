import time
from typing import Dict, Any, List, Optional
from app.domain.employee_models import (
    EmployeeProfileCreate,
    EmployeeMasterRecord,
    EmploymentStatusEnum,
    OrgChartNode,
    LifecycleEventRecord,
    AISuccessorshipRecommendation
)

class CoreEmployeeService:
    employees_db: Dict[str, EmployeeMasterRecord] = {}
    lifecycle_events_db: List[LifecycleEventRecord] = []

    @classmethod
    def create_employee(cls, req: EmployeeProfileCreate) -> EmployeeMasterRecord:
        emp_id = f"EMP-{int(time.time() * 1000)}"
        full_name = f"{req.first_name} {req.last_name}"

        record = EmployeeMasterRecord(
            employee_id=emp_id,
            first_name=req.first_name,
            last_name=req.last_name,
            full_name=full_name,
            email=req.email,
            job_title=req.job_title,
            department_name=req.department_name,
            manager_id=req.manager_id,
            status=EmploymentStatusEnum.PROBATION,
            joining_date=req.joining_date,
            ssn_tax_id="***-**-6789",  # Field-level security masking
            skills=["Python", "LangGraph", "AI Architecture"],
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.employees_db[emp_id] = record

        # Log initial lifecycle event
        cls.lifecycle_events_db.append(LifecycleEventRecord(
            event_id=f"EVT-LC-{int(time.time() * 1000)}",
            employee_id=emp_id,
            event_type="JOINED",
            previous_title="Candidate",
            new_title=req.job_title,
            effective_date=req.joining_date,
            reason="Onboarding Completed & Day 1 Hired"
        ))

        return record

    @classmethod
    def get_org_chart(cls) -> OrgChartNode:
        cls._ensure_defaults()
        root = OrgChartNode(
            employee_id="EMP-100",
            name="Dr. Marcus Vance",
            title="Chief Technology Officer",
            department="Executive",
            direct_reports=[
                OrgChartNode(
                    employee_id="EMP-101",
                    name="Sarah Chen",
                    title="Principal AI Architect",
                    department="Engineering",
                    direct_reports=[]
                ),
                OrgChartNode(
                    employee_id="EMP-102",
                    name="Elena Rostova",
                    title="Lead Workflow Architect",
                    department="Engineering",
                    direct_reports=[]
                )
            ]
        )
        return root

    @classmethod
    def record_lifecycle_event(cls, emp_id: str, event_type: str, new_title: str, reason: str) -> LifecycleEventRecord:
        emp = cls.employees_db.get(emp_id)
        if not emp:
            raise ValueError("Employee ID not found.")

        prev_title = emp.job_title
        emp.job_title = new_title
        if event_type.upper() == "PROMOTION":
            emp.status = EmploymentStatusEnum.PROMOTED
        elif event_type.upper() == "CONFIRMATION":
            emp.status = EmploymentStatusEnum.CONFIRMED

        record = LifecycleEventRecord(
            event_id=f"EVT-LC-{int(time.time() * 1000)}",
            employee_id=emp_id,
            event_type=event_type,
            previous_title=prev_title,
            new_title=new_title,
            effective_date=time.strftime("%Y-%m-%d", time.gmtime()),
            reason=reason
        )
        cls.lifecycle_events_db.append(record)
        return record

    @classmethod
    def recommend_successors(cls, position_title: str) -> List[AISuccessorshipRecommendation]:
        return [
            AISuccessorshipRecommendation(
                position_title=position_title,
                target_successor_id="EMP-101",
                candidate_name="Sarah Chen",
                readiness_score_pct=94.5,
                readiness_timeline="Ready Now",
                skill_gaps=["Executive Board Presentations"]
            ),
            AISuccessorshipRecommendation(
                position_title=position_title,
                target_successor_id="EMP-102",
                candidate_name="Elena Rostova",
                readiness_score_pct=88.0,
                readiness_timeline="Ready in 6 Months",
                skill_gaps=["Distributed Vector Indexing"]
            )
        ]

    @classmethod
    def _ensure_defaults(cls):
        if cls.employees_db:
            return
        cls.create_employee(EmployeeProfileCreate(
            first_name="Sarah", last_name="Chen", email="sarah.chen@talentos.ai", phone="+14155552671",
            job_title="Principal AI Architect", department_name="Engineering", manager_id="EMP-100",
            joining_date="2026-08-15", ssn_tax_id_masked="***-**-6789", base_salary_reference=210000
        ))
