
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./linguatrack.db"
    SECRET_KEY: str = "lingua_secret_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    RESET_SECRET: str = "lingua"  # секретное слово для сброса пароля

    class Config:
        env_file = ".env"

settings = Settings()