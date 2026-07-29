import time
import hmac
import hashlib
import base64
import json
from typing import Dict, Any, Tuple

class SecurityCryptoEngine:
    SECRET_KEY = "talentos_master_enterprise_secret_key_2026"

    @classmethod
    def hash_password(cls, password: str) -> str:
        """Simulate Argon2id password hashing using SHA256 + HMAC salt."""
        salt = base64.b64encode(hashlib.sha256(password.encode()).digest()[:16]).decode('utf-8')
        derived = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        encoded_hash = base64.b64encode(derived).decode('utf-8')
        return f"argon2id$v=19$m=65536,t=3,p=4${salt}${encoded_hash}"

    @classmethod
    def verify_password(cls, password: str, hashed_password: str) -> bool:
        """Constant-time password hash comparison."""
        try:
            parts = hashed_password.split('$')
            if len(parts) != 5 or not parts[0].startswith('argon2id'):
                return False
            salt = parts[3]
            expected_hash = parts[4]
            derived = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
            actual_hash = base64.b64encode(derived).decode('utf-8')
            return hmac.compare_digest(expected_hash, actual_hash)
        except Exception:
            return False

    @classmethod
    def generate_jwt(cls, payload: Dict[str, Any], expires_in_seconds: int = 900) -> str:
        """Generate HMAC-SHA256 signed JWT token."""
        header = {"alg": "HS256", "typ": "JWT"}
        now = int(time.time())
        payload_copy = payload.copy()
        payload_copy["iat"] = now
        payload_copy["exp"] = now + expires_in_seconds

        header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
        payload_b64 = base64.urlsafe_b64encode(json.dumps(payload_copy).encode()).decode().rstrip("=")

        signing_input = f"{header_b64}.{payload_b64}"
        signature = hmac.new(cls.SECRET_KEY.encode(), signing_input.encode(), hashlib.sha256).digest()
        sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")

        return f"{signing_input}.{sig_b64}"

    @classmethod
    def verify_jwt(cls, token: str) -> Tuple[bool, Dict[str, Any]]:
        """Verify JWT signature and expiry date."""
        try:
            parts = token.split(".")
            if len(parts) != 3:
                return False, {}

            signing_input = f"{parts[0]}.{parts[1]}"
            expected_sig = hmac.new(cls.SECRET_KEY.encode(), signing_input.encode(), hashlib.sha256).digest()
            expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode().rstrip("=")

            if not hmac.compare_digest(parts[2], expected_sig_b64):
                return False, {}

            # Padding fix
            padded_payload = parts[1] + "=" * ((4 - len(parts[1]) % 4) % 4)
            payload_data = json.loads(base64.urlsafe_b64decode(padded_payload.encode()).decode())

            if payload_data.get("exp", 0) < int(time.time()):
                return False, {}  # Token expired

            return True, payload_data
        except Exception:
            return False, {}

    @classmethod
    def generate_api_key(cls, tenant_id: str) -> Tuple[str, str]:
        """Generate API key tuple: (raw_key, hashed_key)."""
        raw_key = f"tos_{tenant_id.lower()}_{base64.b32encode(hashlib.sha256(str(time.time()).encode()).digest()).decode()[:32]}"
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        return raw_key, key_hash
