import time
from typing import Dict, Any, List
from app.domain.notification_models import DeliveryStatusEnum, NotificationDeliveryStatusResponse, ChannelEnum

class DeliveryTrackerService:
    delivery_logs: Dict[str, NotificationDeliveryStatusResponse] = {}

    @classmethod
    def record_dispatch(cls, dispatch_id: str, user_id: str, channels: List[ChannelEnum]) -> NotificationDeliveryStatusResponse:
        record = NotificationDeliveryStatusResponse(
            dispatch_id=dispatch_id,
            user_id=user_id,
            channels_dispatched=channels,
            status=DeliveryStatusEnum.SENT,
            dispatched_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.delivery_logs[dispatch_id] = record
        return record

    @classmethod
    def update_status(cls, dispatch_id: str, new_status: DeliveryStatusEnum):
        if dispatch_id in cls.delivery_logs:
            cls.delivery_logs[dispatch_id].status = new_status
