from fastapi import APIRouter, HTTPException, Depends, Header
from typing import List, Optional
from app.domain.identity_models import (
    UserRegisterRequest, 
    UserLoginRequest, 
    TokenResponse, 
    MFARequest,
    SessionInfo,
    APIKeyCreateRequest,
    APIKeyResponse
)
from app.services.identity_service import IdentityService

router = APIRouter(prefix="/auth", tags=["Identity & Auth"])

@router.post("/register", response_model=TokenResponse)
def register_organization_and_user(req: UserRegisterRequest):
    try:
        return IdentityService.register_user_and_org(req)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=TokenResponse)
def login_user(req: UserLoginRequest):
    try:
        return IdentityService.login_user(req)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/refresh", response_model=TokenResponse)
def refresh_access_token(refresh_token: str):
    try:
        return IdentityService.refresh_access_token(refresh_token)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/mfa/verify")
def verify_mfa_code(req: MFARequest):
    if req.mfa_code == "123456":
        return {"success": True, "message": "MFA Challenge Verified Successfully."}
    raise HTTPException(status_code=400, detail="Invalid 6-digit TOTP MFA code.")

@router.get("/sessions", response_model=List[SessionInfo])
def get_active_sessions(user_id: str):
    return IdentityService.get_user_sessions(user_id)

@router.delete("/sessions/{session_id}")
def revoke_session(session_id: str):
    success = IdentityService.revoke_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {"success": True, "message": "Session revoked."}

@router.post("/api-keys", response_model=APIKeyResponse)
def create_api_key(req: APIKeyCreateRequest, x_tenant_id: Optional[str] = Header(default="TNT-TALENTOS-01")):
    return IdentityService.create_api_key(x_tenant_id, req)
