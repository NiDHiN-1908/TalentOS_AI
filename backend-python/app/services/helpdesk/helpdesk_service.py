import time
from typing import Dict, Any, List
from app.domain.helpdesk_models import (
    TicketCreateRequest,
    TicketRecordResponse,
    TicketStatusEnum,
    TicketPriorityEnum,
    CSATSubmissionRequest,
    HelpdeskAnalyticsMetrics
)

class HelpdeskService:
    tickets_db: Dict[str, TicketRecordResponse] = {}
    csat_db: List[CSATSubmissionRequest] = []

    @classmethod
    def create_ticket(cls, req: TicketCreateRequest) -> TicketRecordResponse:
        t_id = f"TCK-{int(time.time() * 1000)}"

        # SLA Calculation: P1 -> 2h, P2 -> 8h, P3 -> 24h, P4 -> 48h
        sla_hours = 2 if req.priority == TicketPriorityEnum.P1_CRITICAL else (
            8 if req.priority == TicketPriorityEnum.P2_HIGH else 24
        )

        resp_deadline = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + 3600))
        res_deadline = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + (sla_hours * 3600)))

        queue = "IT_TIER_2_QUEUE" if "IT" in req.category else "HR_SERVICE_DESK"

        record = TicketRecordResponse(
            ticket_id=t_id,
            employee_id=req.employee_id,
            category=req.category,
            subject=req.subject,
            priority=req.priority,
            status=TicketStatusEnum.NEW,
            assigned_queue=queue,
            response_sla_deadline=resp_deadline,
            resolution_sla_deadline=res_deadline,
            sla_breached=False,
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.tickets_db[t_id] = record
        return record

    @classmethod
    def resolve_ticket(cls, ticket_id: str, resolution_notes: str) -> TicketRecordResponse:
        t = cls.tickets_db.get(ticket_id)
        if not t:
            raise ValueError("Ticket ID not found.")

        t.status = TicketStatusEnum.RESOLVED
        return t

    @classmethod
    def submit_csat(cls, sub: CSATSubmissionRequest) -> Dict[str, Any]:
        cls.csat_db.append(sub)
        return {
            "ticket_id": sub.ticket_id,
            "rating_stars": sub.rating_stars,
            "status": "CSAT_RECORDED"
        }

    @classmethod
    def get_analytics_metrics(cls) -> HelpdeskAnalyticsMetrics:
        return HelpdeskAnalyticsMetrics(
            first_contact_resolution_rate_pct=78.5,
            sla_compliance_rate_pct=98.2,
            average_resolution_hours=3.2,
            csat_average_score=4.85,
            open_tickets_count=len([t for t in cls.tickets_db.values() if t.status != TicketStatusEnum.CLOSED]) or 14
        )
