from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.domain.ai_models import (
    AIChatRequest,
    RAGSearchResult,
    AgentDefinition,
    ToolDefinition,
    AITelemetryLog
)
from app.services.ai_platform_service import AIPlatformService

router = APIRouter(prefix="/ai", tags=["AI Platform Framework"])

@router.post("/chat")
def execute_ai_chat(req: AIChatRequest):
    try:
        return AIPlatformService.execute_agent_chat(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agents", response_model=List[AgentDefinition])
def list_registered_agents():
    AIPlatformService.initialize_default_registries()
    return list(AIPlatformService.agent_registry.values())

@router.get("/tools", response_model=List[ToolDefinition])
def list_registered_tools():
    AIPlatformService.initialize_default_registries()
    return list(AIPlatformService.tool_registry.values())

@router.post("/rag/search", response_model=RAGSearchResult)
def search_policy_rag(query: str):
    return AIPlatformService.search_policy_rag(query)

@router.get("/telemetry", response_model=List[AITelemetryLog])
def get_ai_telemetry():
    return AIPlatformService.telemetry_db
