from app.domain.recruitment_models import RecruitmentAnalyticsResponse

class RecruitmentAnalyticsService:
    @classmethod
    def get_dashboard_metrics(cls) -> RecruitmentAnalyticsResponse:
        return RecruitmentAnalyticsResponse(
            time_to_hire_days=24.5,
            time_to_fill_days=32.0,
            offer_acceptance_rate_pct=88.5,
            active_requisitions_count=14,
            total_candidates_in_pipeline=142,
            cost_per_hire_usd=4200.0
        )
