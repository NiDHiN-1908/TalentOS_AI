from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.integrations.models import (
    PresignedURLRequest,
    PresignedURLResponse,
    EmailSendRequest,
    EmailSendResponse,
    WhatsAppMessageRequest,
    WhatsAppMessageResponse,
    WebhookDispatchEvent,
    WebhookDispatchResponse
)
from app.services.integrations.storage_engine import StorageEngineService
from app.services.integrations.email_platform import EmailPlatformService
from app.services.integrations.whatsapp_platform import WhatsAppPlatformService
from app.services.integrations.webhook_engine import WebhookEngineService
from app.services.integrations.connector_manager import ConnectorManagerService

router = APIRouter(prefix="/integrations", tags=["Integration Platform Mesh"])

@router.post("/storage/presigned-url", response_model=PresignedURLResponse)
def generate_presigned_url(req: PresignedURLRequest):
    return StorageEngineService.generate_presigned_url(req)

@router.post("/email/send", response_model=EmailSendResponse)
def send_email(req: EmailSendRequest):
    return EmailPlatformService.send_email(req)

@router.post("/whatsapp/send", response_model=WhatsAppMessageResponse)
def send_whatsapp_message(req: WhatsAppMessageRequest):
    return WhatsAppPlatformService.send_message(req)

@router.post("/webhooks/dispatch", response_model=WebhookDispatchResponse)
def dispatch_webhook_event(req: WebhookDispatchEvent):
    return WebhookEngineService.dispatch_event(req)

@router.get("/health")
def get_provider_health():
    return ConnectorManagerService.get_provider_health()
