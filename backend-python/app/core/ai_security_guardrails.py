import re
from typing import Dict, Any

class AISecurityGuardrailEngine:
    """
    AI Security Guardrail & Prompt Injection Firewall
    Blocks jailbreak attempts, sanitizes inputs, and redacts PII output data.
    """

    MALICIOUS_PATTERNS = [
        r"ignore (all )?previous instructions",
        r"bypass (system )?prompt",
        r"output (all )?ssn",
        r"system override"
    ]

    @classmethod
    def validate_prompt(cls, prompt_text: str) -> Dict[str, Any]:
        p_lower = prompt_text.lower()
        for pattern in cls.MALICIOUS_PATTERNS:
            if re.search(pattern, p_lower):
                return {
                    "is_safe": False,
                    "risk_flag": "PROMPT_INJECTION_DETECTED",
                    "action_taken": "BLOCKED",
                    "sanitized_prompt": None
                }

        return {
            "is_safe": True,
            "risk_flag": "CLEAN",
            "action_taken": "ALLOWED",
            "sanitized_prompt": prompt_text
        }

    @classmethod
    def redact_output_pii(cls, output_text: str) -> str:
        # Redact SSN patterns
        redacted = re.sub(r'\b\d{3}-\d{2}-\d{4}\b', '[REDACTED_SSN]', output_text)
        # Redact Credit Card patterns
        redacted = re.sub(r'\b(?:\d[ -]*?){13,16}\b', '[REDACTED_CARD]', redacted)
        return redacted
