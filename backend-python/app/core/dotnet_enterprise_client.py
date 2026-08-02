import httpx
from typing import Dict, Any, Optional

class DotNetEnterpriseBusClient:
    """
    Enterprise Service Bus Client for Python AI Platform.
    Enforces Strict Architectural Rule:
    Python AI agents MUST NEVER mutate business state or query database business tables directly.
    Every AI action MUST call enterprise business services exposed by ASP.NET Core (.NET 9 Gateway).
    """

    DOTNET_GATEWAY_URL = "http://localhost:5000/api/v1"

    @classmethod
    async def call_enterprise_service(
        cls, 
        service_domain: str, 
        endpoint: str, 
        method: str = "GET", 
        payload: Optional[Dict[str, Any]] = None,
        jwt_token: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes HTTP/gRPC call from Python AI Engine to ASP.NET Core (.NET 9) Business Platform.
        """
        headers = {
            "Content-Type": "application/json",
            "X-Source-Platform": "Python-AI-Engine-LangGraph",
            "X-Security-Shield": "Active-ZeroTrust"
        }
        if jwt_token:
            headers["Authorization"] = f"Bearer {jwt_token}"

        url = f"{cls.DOTNET_GATEWAY_URL}/{service_domain}/{endpoint.lstrip('/')}"

        async with httpx.AsyncClient(timeout=10.0) as client:
            if method.upper() == "GET":
                response = await client.get(url, headers=headers)
            elif method.upper() == "POST":
                response = await client.post(url, json=payload, headers=headers)
            elif method.upper() == "PUT":
                response = await client.put(url, json=payload, headers=headers)
            elif method.upper() == "DELETE":
                response = await client.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported HTTP method {method}")

            if response.status_code >= 400:
                return {
                    "status": "error",
                    "status_code": response.status_code,
                    "error_detail": response.text
                }

            return response.json()
