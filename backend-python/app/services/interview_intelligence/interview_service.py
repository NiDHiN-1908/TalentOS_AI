import time
from typing import Dict, Any, List
from app.domain.interview_models import (
    ScheduleInterviewRequest,
    InterviewSessionResponse,
    InterviewStatusEnum,
    QuestionItem,
    DetailedScorecardSubmission
)

class InterviewService:
    sessions_db: Dict[str, InterviewSessionResponse] = {}
    scorecards_db: List[DetailedScorecardSubmission] = []

    @classmethod
    def schedule_interview(cls, req: ScheduleInterviewRequest) -> InterviewSessionResponse:
        session_id = f"INT-{int(time.time() * 1000)}"
        video_url = f"https://meet.google.com/tos-int-{session_id.lower()}"

        record = InterviewSessionResponse(
            session_id=session_id,
            candidate_id=req.candidate_id,
            interview_type=req.interview_type,
            status=InterviewStatusEnum.SCHEDULED,
            scheduled_time=req.scheduled_time,
            video_meeting_url=video_url,
            interviewer_names=["Dr. Marcus Vance", "Elena Rostova"]
        )
        cls.sessions_db[session_id] = record
        return record

    @classmethod
    def get_question_bank(cls, category: str = "TECHNICAL") -> List[QuestionItem]:
        return [
            QuestionItem(
                question_id="QST-101",
                category="TECHNICAL",
                question_text="Explain your approach to designing a zero-downtime multi-agent LangGraph supervisor graph.",
                evaluation_rubric="Look for state machine cycle detection, checkpointing, and async node resolution.",
                difficulty="HARD"
            ),
            QuestionItem(
                question_id="QST-102",
                category="BEHAVIORAL",
                question_text="Describe a scenario where you resolved a critical API contract disagreement between frontend and backend teams.",
                evaluation_rubric="Evaluates cross-functional communication, empathy, and technical resolution speed.",
                difficulty="MEDIUM"
            )
        ]

    @classmethod
    def submit_detailed_scorecard(cls, sub: DetailedScorecardSubmission) -> Dict[str, Any]:
        cls.scorecards_db.append(sub)
        avg = round((sub.technical_score + sub.problem_solving_score + sub.communication_score + sub.leadership_score) / 4.0, 1)

        return {
            "session_id": sub.session_id,
            "candidate_id": sub.candidate_id,
            "overall_rating": avg,
            "status": "SCORECARD_RECORDED"
        }
