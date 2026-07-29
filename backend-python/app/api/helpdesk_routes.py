from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.helpdesk_models import (
    TicketCreateRequest,
    TicketRecordResponse,
    AIConversationRequest,
    AIConversationResponse,
    CSATSubmissionRequest,
    HelpdeskAnalyticsMetrics
)
from app.services.helpdesk.helpdesk_service import HelpdeskService
from app.services.helpdesk.ai_support_assistant import AISupportAssistantService

router = APIRouter(prefix="/helpdesk", tags=["Enterprise Employee Helpdesk Platform"])

@router.post("/tickets/create", response_model=TicketRecordResponse)
def create_service_ticket(req: TicketCreateRequest):
    return HelpdeskService.create_ticket(req)

@router.post("/assistant/converse", response_model=AIConversationResponse)
def converse_with_ai_assistant(req: AIConversationRequest):
    return AISupportAssistantService.process_employee_query(req)

@router.post("/tickets/{ticket_id}/resolve", response_model=TicketRecordResponse)
def resolve_service_ticket(ticket_id: str, resolution_notes: str = "Issue resolved by IT Specialist"):
    try:
        return HelpdeskService.resolve_ticket(ticket_id, resolution_notes)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/csat/submit")
def submit_csat_survey(sub: CSATSubmissionRequest):
    return HelpdeskService.submit_csat(sub)

@router.get("/analytics/dashboard", response_model=HelpdeskAnalyticsMetrics)
def get_helpdesk_analytics():
    return HelpdeskService.get_analytics_metrics()
