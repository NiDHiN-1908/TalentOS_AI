import time
from typing import Dict, Any, List, Optional

class EnterpriseAgentRegistry:
    """
    Dynamic Agent Registry & Discovery Service
    Maintains registered sub-agent metadata, capabilities, tools, and health status.
    """
    registry: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def register_sub_agent(
        cls, 
        agent_id: str, 
        name: str, 
        capabilities: List[str], 
        tools: List[str], 
        required_role: str = "EMPLOYEE",
        priority: int = 50
    ):
        cls.registry[agent_id] = {
            "agent_id": agent_id,
            "name": name,
            "capabilities": capabilities,
            "tools": tools,
            "required_role": required_role,
            "priority": priority,
            "health_status": "HEALTHY",
            "registered_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

    @classmethod
    def discover_agents(cls, prompt: str) -> List[Dict[str, Any]]:
        """Discover relevant sub-agents matching user prompt capabilities."""
        cls._ensure_defaults()
        prompt_lower = prompt.lower()
        matched: List[Dict[str, Any]] = []

        if any(k in prompt_lower for k in ["payroll", "salary", "pay"]):
            matched.append(cls.registry["PAYROLL"])
        if any(k in prompt_lower for k in ["recruit", "candidate", "hire", "resume"]):
            matched.append(cls.registry["RECRUITMENT"])
        if any(k in prompt_lower for k in ["onboard", "new hire"]):
            matched.append(cls.registry["ONBOARDING"])

        if not matched:
            matched.append(cls.registry["EXECUTIVE"])

        return sorted(matched, key=lambda x: x["priority"], reverse=True)

    @classmethod
    def _ensure_defaults(cls):
        if cls.registry:
            return

        cls.register_sub_agent(
            agent_id="SUPERVISOR",
            name="Master LangGraph Supervisor Agent",
            capabilities=["task_planning", "intent_routing", "react_reflection", "checkpointing"],
            tools=["db_query", "workflow_execute"],
            required_role="HR_ADMIN",
            priority=100
        )

        cls.register_sub_agent(
            agent_id="PAYROLL",
            name="Payroll Anomaly & Disbursal Agent",
            capabilities=["payroll_audit", "variance_check", "disbursal"],
            tools=["db_payroll_audit", "flag_salary_spike"],
            required_role="PAYROLL_MANAGER",
            priority=90
        )

        cls.register_sub_agent(
            agent_id="RECRUITMENT",
            name="Recruitment ATS & Vector Sourcing Agent",
            capabilities=["resume_parsing", "candidate_scoring", "interview_scheduling"],
            tools=["resume_vector_match", "schedule_interview"],
            required_role="RECRUITER",
            priority=80
        )

        cls.register_sub_agent(
            agent_id="ONBOARDING",
            name="Employee Onboarding Pipeline Agent",
            capabilities=["11_step_onboarding", "it_provisioning", "doc_collection"],
            tools=["dispatch_laptop_ticket", "provision_email"],
            required_role="HR_MANAGER",
            priority=85
        )

        cls.register_sub_agent(
            agent_id="EXECUTIVE",
            name="Executive AI Workforce Briefing Agent",
            capabilities=["csuite_briefing", "headcount_velocity", "health_index"],
            tools=["query_enterprise_kpis"],
            required_role="ORG_OWNER",
            priority=95
        )
