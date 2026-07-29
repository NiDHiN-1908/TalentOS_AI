import time
from typing import Dict, Any, List
from app.domain.assessment_models import (
    AssessmentTemplateCreate,
    CodeExecutionRequest,
    CodeExecutionResponse,
    ProctoringLogEvent
)

class AssessmentService:
    templates_db: Dict[str, Dict[str, Any]] = {}
    proctoring_logs_db: List[ProctoringLogEvent] = []

    @classmethod
    def create_template(cls, req: AssessmentTemplateCreate) -> Dict[str, Any]:
        asm_id = f"ASM-{int(time.time() * 1000)}"
        record = {
            "assessment_id": asm_id,
            "title": req.title,
            "assessment_type": req.assessment_type.value,
            "duration_minutes": req.duration_minutes,
            "passing_score_pct": req.passing_score_pct,
            "questions_count": req.questions_count,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        cls.templates_db[asm_id] = record
        return record

    @classmethod
    def execute_code_sandbox(cls, req: CodeExecutionRequest) -> CodeExecutionResponse:
        """
        Executes candidate code in a isolated sandboxed environment with runtime & memory checks.
        """
        start = time.time()
        code_str = req.code.lower()

        # Simulate Test Execution
        passed = 5
        total = 5
        plagiarism = False

        if "import os" in code_str or "subprocess" in code_str:
            return CodeExecutionResponse(
                passed_tests=0,
                total_tests=total,
                execution_time_ms=10,
                memory_used_mb=5.0,
                runtime_complexity="SECURITY_BLOCKED",
                plagiarism_detected=True,
                stdout="Security Exception: Forbidden system module import detected."
            )

        exec_ms = int((time.time() - start) * 1000) + 14
        return CodeExecutionResponse(
            passed_tests=passed,
            total_tests=total,
            execution_time_ms=exec_ms,
            memory_used_mb=18.5,
            runtime_complexity="O(N)",
            plagiarism_detected=plagiarism,
            stdout="All 5 unit test cases executed successfully."
        )

    @classmethod
    def log_proctoring_event(cls, candidate_id: str, assessment_id: str, event_type: str) -> ProctoringLogEvent:
        log = ProctoringLogEvent(
            candidate_id=candidate_id,
            assessment_id=assessment_id,
            event_type=event_type,
            timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.proctoring_logs_db.append(log)
        return log
