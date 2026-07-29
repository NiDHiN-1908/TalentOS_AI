from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from enum import Enum

class SystemRole(str, Enum):
    PLATFORM_OWNER = "PLATFORM_OWNER"
    PLATFORM_ADMIN = "PLATFORM_ADMIN"
    ORG_OWNER = "ORG_OWNER"
    ORG_ADMIN = "ORG_ADMIN"
    HR_DIRECTOR = "HR_DIRECTOR"
    HR_MANAGER = "HR_MANAGER"
    RECRUITER = "RECRUITER"
    PAYROLL_MANAGER = "PAYROLL_MANAGER"
    FINANCE_MANAGER = "FINANCE_MANAGER"
    DEPARTMENT_MANAGER = "DEPARTMENT_MANAGER"
    TEAM_LEAD = "TEAM_LEAD"
    EMPLOYEE = "EMPLOYEE"
    CANDIDATE = "CANDIDATE"
    GUEST = "GUEST"

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    first_name: str
    last_name: str
    organization_name: Optional[str] = None
    domain: Optional[str] = None

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str
    device_info: Optional[str] = Field(default="Chrome / macOS")

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int = 900
    user_id: str
    email: str
    role: SystemRole
    tenant_id: str

class MFARequest(BaseModel):
    user_id: str
    mfa_code: str = Field(..., min_length=6, max_length=6)

class SessionInfo(BaseModel):
    session_id: str
    user_id: str
    tenant_id: str
    device_info: str
    ip_address: str
    created_at: str
    last_active_at: str
    is_active: bool

class APIKeyCreateRequest(BaseModel):
    name: str = Field(..., example="CI/CD Integration Key")
    scopes: List[str] = Field(default_factory=lambda: ["read:employees", "write:recruitment"])

class APIKeyResponse(BaseModel):
    key_id: str
    name: str
    raw_api_key: str  # Only returned once on creation
    created_at: str
