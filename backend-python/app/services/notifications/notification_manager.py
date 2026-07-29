import time
from typing import Dict, Any, List, Optional
from app.domain.notification_models import (
    NotificationDispatchRequest,
    NotificationDeliveryStatusResponse,
    InAppNotificationItem,
    ChannelEnum,
    DeliveryStatusEnum
)
from app.services.notifications.template_engine import NotificationTemplateEngine
from app.services.notifications.preference_engine import UserPreferenceEngineService
from app.services.notifications.delivery_tracker import DeliveryTrackerService

class NotificationPlatformService:
    in_app_store: List[InAppNotificationItem] = []

    @classmethod
    def dispatch_notification(cls, req: NotificationDispatchRequest) -> NotificationDeliveryStatusResponse:
        dispatch_id = f"DISP-{int(time.time() * 1000)}"
        
        # 1. Preference & Quiet Hours Filter
        active_channels = UserPreferenceEngineService.filter_channels_for_user(
            req.recipient_user_id,
            req.channels,
            req.priority
        )

        # 2. Template Rendering
        subject, body = NotificationTemplateEngine.render(
            req.template_id,
            active_channels[0] if active_channels else ChannelEnum.IN_APP,
            req.template_variables
        )

        # 3. Store In-App Notification if enabled
        if ChannelEnum.IN_APP in active_channels:
            cls.in_app_store.append(InAppNotificationItem(
                notification_id=f"INAPP-{int(time.time() * 1000)}",
                user_id=req.recipient_user_id,
                tenant_id=req.tenant_id or "TNT-TALENTOS-01",
                title=subject,
                message=body,
                category="General",
                is_read=False,
                created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            ))

        # 4. Record Delivery Tracker Status
        return DeliveryTrackerService.record_dispatch(dispatch_id, req.recipient_user_id, active_channels)

    @classmethod
    def get_in_app_notifications(cls, user_id: str) -> List[InAppNotificationItem]:
        return [n for n in cls.in_app_store if n.user_id == user_id]

    @classmethod
    def mark_in_app_as_read(cls, notification_id: str) -> bool:
        for n in cls.in_app_store:
            if n.notification_id == notification_id:
                n.is_read = True
                return True
        return False
