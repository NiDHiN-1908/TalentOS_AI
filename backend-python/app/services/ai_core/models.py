from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class ModelProviderEnum(str, Enum):
    OLLAMA = "OLLAMA"
    LLAMA = "LLAMA"
    QWEN = "QWEN"
    MISTRAL = "MISTRAL"
    GEMMA = "GEMMA"
    DEEPSEEK = "DEEPSEEK"
    GEMINI = "GEMINI"
    OPENAI = "OPENAI"
    ANTHROPIC = "ANTHROPIC"

class PromptCategoryEnum(str, Enum):
    SYSTEM = "SYSTEM"
    DEVELOPER = "DEVELOPER"
    WORKFLOW = "WORKFLOW"
    AGENT = "AGENT"

class PromptTemplate(BaseModel):
    template_id: str
    category: PromptCategoryEnum
    version: int = 1
    content: str = Field(..., example="Hello {{user_name}}, welcome to {{company_name}}.")
    variables: List[str] = Field(default_factory=list)
    created_at: str

class PromptRenderRequest(BaseModel):
    template_id: str
    version: Optional[int] = None
    variables: Dict[str, Any] = Field(default_factory=dict)

class ToolExecutionRequest(BaseModel):
    tool_name: str = Field(..., example="employee_search")
    parameters: Dict[str, Any] = Field(default_factory=dict)
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class ToolExecutionResponse(BaseModel):
    tool_name: str
    success: bool
    result: Any
    error: Optional[str] = None
    execution_time_ms: int

class CoreRAGRequest(BaseModel):
    query: str
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")
    top_k: int = Field(default=5)

class CoreRAGCitation(BaseModel):
    document_name: str
    section: str
    page_number: int
    similarity_score: float

class CoreRAGResponse(BaseModel):
    query: str
    answer: str
    citations: List[CoreRAGCitation]
    confidence_score: float

class CoreTelemetryItem(BaseModel):
    event_id: str
    agent_id: str
    model_provider: ModelProviderEnum
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    cost_usd: float
    latency_ms: int
    reasoning_steps_count: int
    tool_calls_count: int
    timestamp: str
