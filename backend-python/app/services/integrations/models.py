from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class StorageActionEnum(str, Enum):
    READ = "READ"
    WRITE = "WRITE"
    DELETE = "DELETE"

class PresignedURLRequest(BaseModel):
    file_name: str = Field(..., example="resume_sarah_chen.pdf")
    mime_type: str = Field(default="application/pdf")
    action: StorageActionEnum = StorageActionEnum.WRITE
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class PresignedURLResponse(BaseModel):
    file_key: str
    presigned_url: str
    expires_in: int = 900  # 15 minutes
    encryption: str = "AES256"

class EmailSendRequest(BaseModel):
    to_email: EmailStr
    subject: str
    template_name: str = Field(default="welcome_offer")
    template_variables: Dict[str, Any] = Field(default_factory=dict)
    attachments: Optional[List[Dict[str, str]]] = None

class EmailSendResponse(BaseModel):
    message_id: str
    status: str = "DISPATCHED"
    recipient: str
    dispatched_at: str

class WhatsAppMessageRequest(BaseModel):
    to_phone: str = Field(..., example="+14155552671")
    template_name: str = Field(default="interview_reminder")
    variables: Dict[str, Any] = Field(default_factory=dict)

class WhatsAppMessageResponse(BaseModel):
    message_id: str
    status: str = "SENT"
    recipient: str

class WebhookDispatchEvent(BaseModel):
    event_type: str = Field(..., example="talentos.employee.created")
    tenant_id: str = Field(default="TNT-TALENTOS-01")
    payload: Dict[str, Any]

class WebhookDispatchResponse(BaseModel):
    event_id: str
    signature: str
    subscribers_notified: int
    status: str = "DELIVERED"
