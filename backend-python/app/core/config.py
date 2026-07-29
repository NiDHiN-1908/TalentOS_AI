from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TalentOS AI Python Engine"
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str = "simulated_gemini_api_key"
    DEFAULT_TENANT_ID: str = "TNT-TALENTOS-01"
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:5173", "*"]

    class Config:
        case_sensitive = True

settings = Settings()
