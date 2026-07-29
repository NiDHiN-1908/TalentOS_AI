from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class ChannelEnum(str, Enum):
    EMAIL = "EMAIL"
    SMS = "SMS"
    WHATSAPP = "WHATSAPP"
    TEAMS = "TEAMS"
    SLACK = "SLACK"
    PUSH = "PUSH"
    IN_APP = "IN_APP"

class PriorityEnum(str, Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    EMERGENCY = "EMERGENCY"

class DeliveryStatusEnum(str, Enum):
    QUEUED = "QUEUED"
    SENT = "SENT"
    DELIVERED = "DELIVERED"
    READ = "READ"
    FAILED = "FAILED"
    RETRYING = "RETRYING"

class NotificationDispatchRequest(BaseModel):
    recipient_user_id: str
    recipient_email: Optional[EmailStr] = None
    recipient_phone: Optional[str] = None
    channels: List[ChannelEnum] = Field(default_factory=lambda: [ChannelEnum.EMAIL, ChannelEnum.IN_APP])
    priority: PriorityEnum = PriorityEnum.NORMAL
    template_id: str = Field(..., example="offer_letter_accepted")
    template_variables: Dict[str, Any] = Field(default_factory=dict)
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class NotificationTemplate(BaseModel):
    template_id: str
    channel: ChannelEnum
    subject: Optional[str] = None
    body_content: str
    version: int = 1

class UserPreferenceModel(BaseModel):
    user_id: str
    enabled_channels: List[ChannelEnum]
    quiet_hours_start: Optional[str] = Field(default="22:00")  # 10 PM
    quiet_hours_end: Optional[str] = Field(default="07:00")    # 7 AM
    time_zone: str = Field(default="UTC")

class InAppNotificationItem(BaseModel):
    notification_id: str
    user_id: str
    tenant_id: str
    title: str
    message: str
    category: str
    is_read: bool = False
    created_at: str

class NotificationDeliveryStatusResponse(BaseModel):
    dispatch_id: str
    user_id: str
    channels_dispatched: List[ChannelEnum]
    status: DeliveryStatusEnum
    dispatched_at: str
