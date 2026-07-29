import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security_crypto import SecurityCryptoEngine

client = TestClient(app)

def test_password_hashing():
    password = "SuperSecretPassword123!"
    hashed = SecurityCryptoEngine.hash_password(password)
    assert hashed.startswith("argon2id")
    assert SecurityCryptoEngine.verify_password(password, hashed) is True
    assert SecurityCryptoEngine.verify_password("WrongPassword", hashed) is False

def test_user_registration_and_login():
    email = "cso.admin@talentos.ai"
    reg_payload = {
        "email": email,
        "password": "SecurePassword123!",
        "first_name": "Chief",
        "last_name": "Security",
        "organization_name": "TalentOS Enterprise",
        "domain": "talentos"
    }

    # 1. Register User & Org
    reg_response = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_response.status_code == 200
    data = reg_response.json()
    assert "access_token" in data
    assert data["role"] == "ORG_OWNER"
    assert data["email"] == email

    # 2. Login User
    login_response = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "SecurePassword123!", "device_info": "Pytest Automation"}
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert login_data["email"] == email

def test_brute_force_account_lockout():
    email = "target.user@talentos.ai"
    client.post("/api/v1/auth/register", json={
        "email": email,
        "password": "CorrectPassword123!",
        "first_name": "Target",
        "last_name": "User"
    })

    # Fail 5 times
    for _ in range(5):
        client.post("/api/v1/auth/login", json={"email": email, "password": "BadPassword"})

    # 6th attempt should be locked out
    locked_response = client.post("/api/v1/auth/login", json={"email": email, "password": "CorrectPassword123!"})
    assert locked_response.status_code == 401
    assert "locked" in locked_response.json()["detail"].lower()

def test_api_key_creation():
    response = client.post(
        "/api/v1/auth/api-keys",
        json={"name": "Production Deploy Key", "scopes": ["read:employees"]},
        headers={"X-Tenant-ID": "TNT-TALENTOS-01"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "raw_api_key" in data
    assert data["raw_api_key"].startswith("tos_")
