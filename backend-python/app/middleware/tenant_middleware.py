from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.security_crypto import SecurityCryptoEngine

class TenantIsolationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Exclude public endpoints
        if request.url.path.startswith("/docs") or request.url.path.startswith("/openapi") or request.url.path in ["/health", "/api/v1/auth/login", "/api/v1/auth/register"]:
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            valid, payload = SecurityCryptoEngine.verify_jwt(token)
            if valid:
                request.state.tenant_id = payload.get("tenant_id")
                request.state.user_id = payload.get("sub")
                request.state.role = payload.get("role")
                
                response = await call_next(request)
                response.headers["X-Tenant-ID"] = request.state.tenant_id or "UNKNOWN"
                response.headers["X-Security-Shield"] = "Active"
                return response

        return await call_next(request)
