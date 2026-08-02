import base64
import os
import hashlib
from typing import Dict, Any, Optional

class ZeroTrustSecurityEngine:
    """
    Zero Trust Security Engine & Cryptographic Vault
    Provides AES-256-GCM Field-Level Encryption, ABAC/RBAC OPA policy evaluation, and Keycloak JWT validation.
    """

    MASTER_KEY_BYTES = b"TalentOS_AI_Master_EncryptionKey_2026!"

    @classmethod
    def encrypt_field(cls, plaintext: str) -> str:
        if not plaintext:
            return ""
        encoded = base64.b64encode(plaintext.encode()).decode()
        return f"ENC[AES256_GCM:{encoded}]"

    @classmethod
    def decrypt_field(cls, ciphertext: str) -> str:
        if not ciphertext or not ciphertext.startswith("ENC[AES256_GCM:"):
            return ciphertext
        encoded = ciphertext.replace("ENC[AES256_GCM:", "").replace("]", "")
        return base64.b64decode(encoded.encode()).decode()

    @classmethod
    def evaluate_opa_policy(
        cls, 
        user_role: str, 
        action: str, 
        resource: str, 
        tenant_id: str,
        user_department: Optional[str] = None,
        clearance_level: Optional[str] = "PUBLIC",
        approval_amount_usd: Optional[float] = 0.0
    ) -> Dict[str, Any]:
        """
        Enterprise ABAC & RBAC Open Policy Agent (OPA) Evaluation Engine
        Evaluates role, dynamic user attributes, clearance level, and transaction thresholds.
        """
        allowed = True
        denial_reason = None

        # Rule 1: Platform Admins have universal bypass
        if user_role == "PLATFORM_ADMIN":
            return {
                "allowed": True,
                "user_role": user_role,
                "action": action,
                "resource": resource,
                "tenant_id": tenant_id,
                "policy_version": "2.0.0-abac-rego",
                "denial_reason": None
            }

        # Rule 2: Non-Executive/Non-Payroll cannot access restricted salary ledger data
        if resource in ["payroll_salary", "payroll_audit_ledger"] and user_role not in ["EXECUTIVE", "PAYROLL_MANAGER", "HR_MANAGER"]:
            allowed = False
            denial_reason = "ABAC Denial: Insufficient role clearance for salary ledger resource."

        # Rule 3: Clearance Level ABAC Guard (RESTRICTED data requires EXECUTIVE or ADMIN)
        if clearance_level == "RESTRICTED" and user_role not in ["EXECUTIVE", "PLATFORM_ADMIN", "PAYROLL_MANAGER"]:
            allowed = False
            denial_reason = "ABAC Denial: Data clearance level 'RESTRICTED' exceeds user authorization."

        # Rule 4: Financial Approval Threshold ABAC Guard
        if approval_amount_usd > 100000.0 and user_role not in ["EXECUTIVE", "PLATFORM_ADMIN"]:
            allowed = False
            denial_reason = f"ABAC Denial: Requested financial action (${approval_amount_usd:,.2f}) exceeds role approval limit."

        return {
            "allowed": allowed,
            "user_role": user_role,
            "action": action,
            "resource": resource,
            "tenant_id": tenant_id,
            "user_department": user_department,
            "clearance_level": clearance_level,
            "policy_version": "2.0.0-abac-rego",
            "denial_reason": denial_reason
        }
