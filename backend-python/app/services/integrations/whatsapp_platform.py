import time
from app.services.integrations.models import WhatsAppMessageRequest, WhatsAppMessageResponse

class WhatsAppPlatformService:
    @classmethod
    def send_message(cls, req: WhatsAppMessageRequest) -> WhatsAppMessageResponse:
        message_id = f"MSG-WA-{int(time.time() * 1000)}"
        return WhatsAppMessageResponse(
            message_id=message_id,
            status="SENT",
            recipient=req.to_phone
        )
