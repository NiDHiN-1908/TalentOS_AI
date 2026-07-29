import time
from typing import Dict, Any, List, Optional
from app.domain.identity_models import (
    UserRegisterRequest, 
    UserLoginRequest, 
    TokenResponse, 
    SystemRole, 
    SessionInfo,
    APIKeyCreateRequest,
    APIKeyResponse
)
from app.core.security_crypto import SecurityCryptoEngine

class IdentityService:
    # In-memory tenant data stores simulating PostgreSQL RLS
    users_db: Dict[str, Dict[str, Any]] = {}
    organizations_db: Dict[str, Dict[str, Any]] = {}
    sessions_db: Dict[str, SessionInfo] = {}
    failed_attempts_db: Dict[str, int] = {}
    api_keys_db: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def register_user_and_org(cls, req: UserRegisterRequest) -> TokenResponse:
        """Register a new user and organization with tenant isolation."""
        if req.email in cls.users_db:
            raise ValueError("User with this email already exists.")

        org_id = f"TNT-{req.domain or 'CUSTOM'}-{int(time.time())}"
        user_id = f"USR-{int(time.time() * 1000)}"
        hashed_pw = SecurityCryptoEngine.hash_password(req.password)

        cls.organizations_db[org_id] = {
            "id": org_id,
            "name": req.organization_name or "TalentOS Org",
            "domain": req.domain or "talentos.ai",
            "status": "ACTIVE"
        }

        user_data = {
            "id": user_id,
            "email": req.email,
            "password_hash": hashed_pw,
            "first_name": req.first_name,
            "last_name": req.last_name,
            "tenant_id": org_id,
            "role": SystemRole.ORG_OWNER,
            "mfa_enabled": False
        }
        cls.users_db[req.email] = user_data

        return cls._create_tokens_and_session(user_data, "Web / Registration")

    @classmethod
    def login_user(cls, req: UserLoginRequest) -> TokenResponse:
        """Authenticate user credentials with brute-force protection & session tracking."""
        email = req.email
        attempts = cls.failed_attempts_db.get(email, 0)
        if attempts >= 5:
            raise ValueError("Account locked due to 5 failed login attempts. Try again in 15 minutes.")

        user = cls.users_db.get(email)
        if not user or not SecurityCryptoEngine.verify_password(req.password, user["password_hash"]):
            cls.failed_attempts_db[email] = attempts + 1
            raise ValueError("Invalid credentials.")

        # Reset failed attempts on success
        cls.failed_attempts_db[email] = 0

        return cls._create_tokens_and_session(user, req.device_info or "Unknown Device")

    @classmethod
    def refresh_access_token(cls, refresh_token: str) -> TokenResponse:
        """Rotate refresh token and issue new access token."""
        valid, payload = SecurityCryptoEngine.verify_jwt(refresh_token)
        if not valid or payload.get("type") != "refresh":
            raise ValueError("Invalid or expired refresh token.")

        email = payload.get("email")
        user = cls.users_db.get(email)
        if not user:
            raise ValueError("User not found.")

        return cls._create_tokens_and_session(user, "Refreshed Session")

    @classmethod
    def create_api_key(cls, tenant_id: str, req: APIKeyCreateRequest) -> APIKeyResponse:
        """Generate single-read API key for external service integrations."""
        raw_key, key_hash = SecurityCryptoEngine.generate_api_key(tenant_id)
        key_id = f"KEY-{int(time.time() * 1000)}"

        cls.api_keys_db[key_id] = {
            "key_id": key_id,
            "tenant_id": tenant_id,
            "name": req.name,
            "key_hash": key_hash,
            "scopes": req.scopes,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

        return APIKeyResponse(
            key_id=key_id,
            name=req.name,
            raw_api_key=raw_key,
            created_at=cls.api_keys_db[key_id]["created_at"]
        )

    @classmethod
    def get_user_sessions(cls, user_id: str) -> List[SessionInfo]:
        """List active login sessions for a user."""
        return [s for s in cls.sessions_db.values() if s.user_id == user_id and s.is_active]

    @classmethod
    def revoke_session(cls, session_id: str) -> bool:
        """Revoke active login session."""
        if session_id in cls.sessions_db:
            cls.sessions_db[session_id].is_active = False
            return True
        return False

    @classmethod
    def _create_tokens_and_session(cls, user: Dict[str, Any], device_info: str) -> TokenResponse:
        session_id = f"SES-{int(time.time() * 1000)}"
        access_payload = {
            "sub": user["id"],
            "email": user["email"],
            "role": user["role"],
            "tenant_id": user["tenant_id"],
            "session_id": session_id,
            "type": "access"
        }
        refresh_payload = {
            "sub": user["id"],
            "email": user["email"],
            "session_id": session_id,
            "type": "refresh"
        }

        access_token = SecurityCryptoEngine.generate_jwt(access_payload, expires_in_seconds=900)
        refresh_token = SecurityCryptoEngine.generate_jwt(refresh_payload, expires_in_seconds=604800)

        session = SessionInfo(
            session_id=session_id,
            user_id=user["id"],
            tenant_id=user["tenant_id"],
            device_info=device_info,
            ip_address="127.0.0.1",
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            last_active_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            is_active=True
        )
        cls.sessions_db[session_id] = session

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=900,
            user_id=user["id"],
            email=user["email"],
            role=user["role"],
            tenant_id=user["tenant_id"]
        )
