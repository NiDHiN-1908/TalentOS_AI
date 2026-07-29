from typing import Dict, Any, Tuple
from app.domain.notification_models import ChannelEnum, NotificationTemplate

class NotificationTemplateEngine:
    # In-memory template library
    templates_db: Dict[str, NotificationTemplate] = {}

    @classmethod
    def initialize_default_templates(cls):
        if cls.templates_db:
            return

        cls.templates_db["offer_letter_accepted"] = NotificationTemplate(
            template_id="offer_letter_accepted",
            channel=ChannelEnum.EMAIL,
            subject="Congratulations {{candidate_name}}! Offer Accepted for {{role_title}}",
            body_content="Dear {{candidate_name}},\n\nWe are thrilled to welcome you to the {{department}} team at {{company_name}} as {{role_title}}.\n\nYour start date is set for {{start_date}}.",
            version=1
        )

        cls.templates_db["workflow_approval_request"] = NotificationTemplate(
            template_id="workflow_approval_request",
            channel=ChannelEnum.IN_APP,
            subject="Action Required: Approval Needed for {{workflow_name}}",
            body_content="Approval requested by {{requester_name}} for {{workflow_name}} (SLA: 24h).",
            version=1
        )

    @classmethod
    def render(cls, template_id: str, channel: ChannelEnum, variables: Dict[str, Any]) -> Tuple[str, str]:
        """
        Render subject and body for target template and channel.
        Returns: (rendered_subject, rendered_body)
        """
        cls.initialize_default_templates()
        template = cls.templates_db.get(template_id)

        if not template:
            # Fallback inline template
            subject = f"Notification Alert: {template_id}"
            body = f"Notification details for {variables}"
            return subject, body

        subject = template.subject or "TalentOS AI Notification"
        body = template.body_content

        for key, val in variables.items():
            subject = subject.replace(f"{{{{{key}}}}}", str(val))
            body = body.replace(f"{{{{{key}}}}}", str(val))

        return subject, body
