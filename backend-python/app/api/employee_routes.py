from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.employee_models import (
    EmployeeProfileCreate,
    EmployeeMasterRecord,
    OrgChartNode,
    LifecycleEventRecord,
    AISuccessorshipRecommendation
)
from app.services.employee_core.employee_service import CoreEmployeeService

router = APIRouter(prefix="/employee", tags=["Enterprise Core Employee Management Platform"])

@router.post("/profiles", response_model=EmployeeMasterRecord)
def create_employee_profile(req: EmployeeProfileCreate):
    try:
        return CoreEmployeeService.create_employee(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/directory/search", response_model=List[EmployeeMasterRecord])
def search_employee_directory(query: str = ""):
    CoreEmployeeService._ensure_defaults()
    if not query.strip():
        return list(CoreEmployeeService.employees_db.values())
    q_lower = query.lower()
    return [e for e in CoreEmployeeService.employees_db.values() if q_lower in e.full_name.lower() or q_lower in e.job_title.lower()]

@router.get("/org-chart", response_model=OrgChartNode)
def get_org_chart_hierarchy():
    return CoreEmployeeService.get_org_chart()

@router.post("/lifecycle/event", response_model=LifecycleEventRecord)
def record_employee_lifecycle_event(emp_id: str, event_type: str = "PROMOTION", new_title: str = "VP AI Engineering", reason: str = "Annual Review"):
    try:
        return CoreEmployeeService.record_lifecycle_event(emp_id, event_type, new_title, reason)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/ai/successors", response_model=List[AISuccessorshipRecommendation])
def get_ai_successor_recommendations(position_title: str = "Chief Technology Officer"):
    return CoreEmployeeService.recommend_successors(position_title)
