from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.notification_models import (
    NotificationDispatchRequest,
    NotificationDeliveryStatusResponse,
    InAppNotificationItem
)
from app.services.notifications.notification_manager import NotificationPlatformService
from app.services.notifications.delivery_tracker import DeliveryTrackerService

router = APIRouter(prefix="/notifications", tags=["Enterprise Notification & Communication Platform"])

@router.post("/dispatch", response_model=NotificationDeliveryStatusResponse)
def dispatch_notification(req: NotificationDispatchRequest):
    try:
        return NotificationPlatformService.dispatch_notification(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/in-app", response_model=List[InAppNotificationItem])
def get_user_in_app_notifications(user_id: str):
    return NotificationPlatformService.get_in_app_notifications(user_id)

@router.post("/in-app/{notification_id}/read")
def mark_in_app_as_read(notification_id: str):
    success = NotificationPlatformService.mark_in_app_as_read(notification_id)
    if not success:
        raise HTTPException(status_code=404, detail="In-app notification not found.")
    return {"success": True, "message": "Marked as read."}

@router.get("/delivery/{dispatch_id}", response_model=NotificationDeliveryStatusResponse)
def get_delivery_status(dispatch_id: str):
    record = DeliveryTrackerService.delivery_logs.get(dispatch_id)
    if not record:
        raise HTTPException(status_code=404, detail="Delivery status record not found.")
    return record
