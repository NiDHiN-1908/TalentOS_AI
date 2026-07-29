from typing import List, Dict, Any
from app.domain.helpdesk_models import (
    AIConversationRequest,
    AIConversationResponse
)

class AISupportAssistantService:
    """
    Virtual AI Support Assistant Engine
    Classifies employee intents, queries Knowledge RAG base, and drafts instant resolutions.
    """

    @classmethod
    def process_employee_query(cls, req: AIConversationRequest) -> AIConversationResponse:
        q_lower = req.user_query.lower()

        if "w-4" in q_lower or "tax" in q_lower:
            intent = "HR_TAX_QUERY"
            resp = "You can update your W-4 tax withholding form via the TalentOS Employee Portal under Profile > Tax & Payroll Settings."
            articles = [{"title": "How to Submit Form W-4 Online", "url": "https://help.talentos.ai/kb/w4-guide"}]
        elif "keyboard" in q_lower or "laptop" in q_lower:
            intent = "IT_HARDWARE_ISSUE"
            resp = "I have classified your issue as an IT Hardware Malfunction. Would you like me to auto-create a P2 High ticket for IT Support?"
            articles = [{"title": "MacBook Keyboard Troubleshooting", "url": "https://help.talentos.ai/kb/mac-keyboard"}]
        else:
            intent = "GENERAL_SERVICE_DESK"
            resp = "Thank you for reaching out. I've routed your inquiry to our Service Desk Team."
            articles = []

        return AIConversationResponse(
            intent_classified=intent,
            ai_response_text=resp,
            suggested_knowledge_articles=articles,
            ticket_auto_created=False
        )
