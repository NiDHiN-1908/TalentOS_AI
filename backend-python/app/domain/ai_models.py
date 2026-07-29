from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ModelProviderEnum(str, Enum):
    OLLAMA = "OLLAMA"
    LLAMA = "LLAMA"
    QWEN = "QWEN"
    MISTRAL = "MISTRAL"
    DEEPSEEK = "DEEPSEEK"
    GEMMA = "GEMMA"
    OPENAI = "OPENAI"
    ANTHROPIC = "ANTHROPIC"
    GEMINI = "GEMINI"

class AgentMemoryTypeEnum(str, Enum):
    WORKING = "WORKING"
    EPISODIC = "EPISODIC"
    SEMANTIC = "SEMANTIC"

class AgentDefinition(BaseModel):
    agent_id: str
    name: str
    description: str
    model_provider: ModelProviderEnum = ModelProviderEnum.GEMINI
    system_prompt: str
    tools: List[str] = Field(default_factory=list)
    memory_enabled: bool = True

class ToolDefinition(BaseModel):
    name: str
    description: str
    parameters_schema: Dict[str, Any]

class AIChatRequest(BaseModel):
    prompt: str = Field(..., example="Audit July payroll anomalies and search remote work policy")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")
    model_provider: Optional[ModelProviderEnum] = Field(default=ModelProviderEnum.GEMINI)

class RAGSearchResult(BaseModel):
    query: str
    answer: str
    citations: List[Dict[str, Any]]
    confidence_score: float

class AITelemetryLog(BaseModel):
    dag_id: str
    prompt: str
    model_used: str
    total_tokens: int
    prompt_tokens: int
    completion_tokens: int
    cost_usd: float
    latency_ms: int
    quality_score: float
    timestamp: str
