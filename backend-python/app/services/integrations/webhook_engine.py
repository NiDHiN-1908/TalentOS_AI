import time
import hmac
import hashlib
import json
from app.services.integrations.models import WebhookDispatchEvent, WebhookDispatchResponse

class WebhookEngineService:
    SECRET = "talentos_webhook_signing_secret_2026"

    @classmethod
    def dispatch_event(cls, req: WebhookDispatchEvent) -> WebhookDispatchResponse:
        event_id = f"EVT-WH-{int(time.time() * 1000)}"
        payload_bytes = json.dumps(req.payload).encode()
        signature = hmac.new(cls.SECRET.encode(), payload_bytes, hashlib.sha256).hexdigest()

        return WebhookDispatchResponse(
            event_id=event_id,
            signature=f"sha256={signature}",
            subscribers_notified=3,
            status="DELIVERED"
        )
