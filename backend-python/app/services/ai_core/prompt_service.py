import time
from typing import Dict, Any, List, Optional
from app.services.ai_core.models import PromptTemplate, PromptCategoryEnum, PromptRenderRequest

class PromptService:
    # In-memory prompt template store
    templates_db: Dict[str, PromptTemplate] = {}

    @classmethod
    def register_template(cls, template_id: str, category: PromptCategoryEnum, content: str, variables: List[str]) -> PromptTemplate:
        tmpl = PromptTemplate(
            template_id=template_id,
            category=category,
            version=1,
            content=content,
            variables=variables,
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.templates_db[template_id] = tmpl
        return tmpl

    @classmethod
    def render_prompt(cls, req: PromptRenderRequest) -> str:
        tmpl = cls.templates_db.get(req.template_id)
        if not tmpl:
            # Fallback inline template if not registered
            return f"Prompt for {req.template_id}: {req.variables}"

        rendered = tmpl.content
        for key, val in req.variables.items():
            rendered = rendered.replace(f"{{{{{key}}}}}", str(val))

        return rendered
