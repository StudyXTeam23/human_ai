"""Application configuration."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    app_name: str = "AI Text Humanizer API"
    app_version: str = "1.0.0"
    cors_origins: list[str] = [
        "http://localhost:18200",
        "http://13.52.175.51:18200",
        "http://13.52.175.51:18201",
    ]
    log_level: str = "INFO"
    
    # OpenAI API Configuration
    openai_api_key: str = "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"
    openai_model: str = "gpt-4o-mini"  # Use a stable model
    openai_api_url: str = "https://api.openai.com/v1/chat/completions"

    class Config:
        env_file = ".env"


settings = Settings()

