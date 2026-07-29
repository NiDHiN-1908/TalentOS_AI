from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.ai_core.models import (
    PromptRenderRequest,
    ToolExecutionRequest,
    ToolExecutionResponse,
    CoreRAGRequest,
    CoreRAGResponse,
    CoreTelemetryItem
)
from app.services.ai_core.model_router_service import ModelRouterService
from app.services.ai_core.prompt_service import PromptService
from app.services.ai_core.memory_service import CoreMemoryService
from app.services.ai_core.tool_execution_service import ToolExecutionEngineService
from app.services.ai_core.rag_core_service import RAGCoreService
from app.services.ai_core.ai_telemetry_service import AITelemetryService

router = APIRouter(prefix="/ai-core", tags=["AI Core Shared Platform"])

@router.post("/router/generate")
def route_and_generate_completion(prompt: str, task_type: str = "general"):
    completion, telemetry = ModelRouterService.route_and_generate(prompt, task_type)
    return {"completion": completion, "telemetry": telemetry}

@router.post("/prompts/render")
def render_prompt_template(req: PromptRenderRequest):
    return {"rendered_prompt": PromptService.render_prompt(req)}

@router.post("/memory/query")
def query_memory_stores(tenant_id: str, query: str):
    return CoreMemoryService.query_memories(tenant_id, query)

@router.post("/tools/execute", response_model=ToolExecutionResponse)
def execute_tool_call(req: ToolExecutionRequest):
    return ToolExecutionEngineService.execute_tool(req)

@router.post("/rag/search", response_model=CoreRAGResponse)
def execute_rag_search(req: CoreRAGRequest):
    return RAGCoreService.execute_rag_query(req)

@router.get("/telemetry", response_model=List[CoreTelemetryItem])
def get_ai_core_telemetry():
    return AITelemetryService.telemetry_logs
