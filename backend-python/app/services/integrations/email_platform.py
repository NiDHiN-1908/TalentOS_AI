import time
from app.services.integrations.models import EmailSendRequest, EmailSendResponse

class EmailPlatformService:
    @classmethod
    def send_email(cls, req: EmailSendRequest) -> EmailSendResponse:
        message_id = f"MSG-EMAIL-{int(time.time() * 1000)}"
        return EmailSendResponse(
            message_id=message_id,
            status="DISPATCHED",
            recipient=req.to_email,
            dispatched_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
