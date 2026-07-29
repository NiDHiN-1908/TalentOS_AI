import time
from typing import Dict, Any, List, Optional
from app.domain.onboarding_models import (
    PreboardingSubmissionRequest,
    OnboardingJourneyResponse,
    OnboardingStatusEnum,
    DepartmentTaskCategoryEnum,
    OnboardingTaskItem,
    ITProvisioningResult,
    OnboardingAnalyticsMetrics
)

class OnboardingService:
    journeys_db: Dict[str, OnboardingJourneyResponse] = {}

    @classmethod
    def start_onboarding_journey(cls, req: PreboardingSubmissionRequest) -> OnboardingJourneyResponse:
        jid = f"ONB-{int(time.time() * 1000)}"
        corp_email = f"{req.candidate_name.lower().replace(' ', '.')}@talentos.ai"

        default_tasks = [
            OnboardingTaskItem(task_id=f"TSK-HR-1", category=DepartmentTaskCategoryEnum.HR, title="Verify Form W-4 & I-9 Tax Documents", assignee_role="HR_SPECIALIST", is_completed=True, due_days_from_start=-3),
            OnboardingTaskItem(task_id=f"TSK-IT-1", category=DepartmentTaskCategoryEnum.IT, title="Provision Corporate Email & SSO Credentials", assignee_role="IT_ADMIN", is_completed=True, due_days_from_start=-5),
            OnboardingTaskItem(task_id=f"TSK-IT-2", category=DepartmentTaskCategoryEnum.IT, title="Ship MacBook Pro M3 Max Laptop & YubiKey", assignee_role="IT_LOGISTICS", is_completed=True, due_days_from_start=-7),
            OnboardingTaskItem(task_id=f"TSK-MGR-1", category=DepartmentTaskCategoryEnum.MANAGER, title="Assign Onboarding Buddy & Schedule Day 1 1-on-1", assignee_role="HIRING_MANAGER", is_completed=False, due_days_from_start=1),
            OnboardingTaskItem(task_id=f"TSK-LRN-1", category=DepartmentTaskCategoryEnum.LEARNING, title="Complete Security Awareness Training", assignee_role="EMPLOYEE", is_completed=False, due_days_from_start=3)
        ]

        record = OnboardingJourneyResponse(
            journey_id=jid,
            candidate_name=req.candidate_name,
            corporate_email=corp_email,
            joining_date=req.target_joining_date,
            status=OnboardingStatusEnum.IT_PROVISIONING,
            assigned_buddy="Elena Rostova (Lead Architect)",
            progress_percentage=60.0,
            tasks=default_tasks,
            ai_risk_score_pct=12.5,
            ai_risk_assessment="Low risk: 3 of 5 onboarding tasks completed. IT hardware dispatched."
        )
        cls.journeys_db[jid] = record
        return record

    @classmethod
    def execute_it_provisioning(cls, candidate_name: str) -> ITProvisioningResult:
        corp_email = f"{candidate_name.lower().replace(' ', '.')}@talentos.ai"
        prov_id = f"PRV-{int(time.time() * 1000)}"

        return ITProvisioningResult(
            provisioning_id=prov_id,
            corporate_email=corp_email,
            sso_account_created=True,
            laptop_ticket_id=f"TKT-HARDWARE-{int(time.time() * 1000)}",
            software_licenses_assigned=["Slack", "Google Workspace", "GitHub Enterprise", "PyTorch Studio"],
            status="PROVISIONED"
        )

    @classmethod
    def complete_task(cls, journey_id: str, task_id: str) -> OnboardingJourneyResponse:
        journey = cls.journeys_db.get(journey_id)
        if not journey:
            raise ValueError("Onboarding journey ID not found.")

        for t in journey.tasks:
            if t.task_id == task_id:
                t.is_completed = True
                t.completed_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        completed_count = sum(1 for t in journey.tasks if t.is_completed)
        journey.progress_percentage = round((completed_count / len(journey.tasks)) * 100, 1)

        if journey.progress_percentage >= 100.0:
            journey.status = OnboardingStatusEnum.COMPLETED

        return journey

    @classmethod
    def get_analytics_metrics(cls) -> OnboardingAnalyticsMetrics:
        return OnboardingAnalyticsMetrics(
            onboarding_completion_rate_pct=96.5,
            average_completion_days=4.2,
            it_provisioning_sla_met_pct=98.0,
            active_onboarding_journeys=len(cls.journeys_db) or 12
        )
