"""Configuration management for the RAG Chatbot API."""


from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API Keys
    cohere_api_key: str = Field(default="", repr=False)
    gemini_api_key: str = Field(default="", repr=False)
    openai_api_key: str = Field(default="", repr=False)

    # Database settings
    neon_postgres_url: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/test_db",
        validation_alias=AliasChoices("NEON_POSTGRES_URL", "DATABASE_URL"),
    )

    # Qdrant settings
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: str = Field(default="", repr=False)

    # Server settings
    uvicorn_host: str = "0.0.0.0"
    uvicorn_port: int = 8000

    # Application settings
    app_name: str = "RAG Chatbot API"
    environment: str = Field(
        default="development",
        validation_alias=AliasChoices("APP_ENV", "ENVIRONMENT"),
    )
    debug: bool = False
    max_query_length: int = 1000
    max_context_length: int = 2000
    max_concurrent_requests: int = 100

    # Cohere settings
    cohere_model: str = "embed-multilingual-v2.0"
    qdrant_collection: str = "Book-Embedding"
    openai_model: str = "gpt-4o-mini"

    # Authentication settings
    secret_key: str = Field(
        default="",
        repr=False,
        validation_alias=AliasChoices("JWT_SECRET_KEY", "SECRET_KEY"),
    )
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "allow"  # Allow extra fields from .env that aren't defined in the model


# Global settings instance - will be initialized when get_settings is called
_settings_instance = None


def get_settings():
    """Get settings instance, loading from environment if needed."""
    global _settings_instance
    if _settings_instance is None:
        _settings_instance = Settings()
    return _settings_instance


def get_jwt_secret() -> str:
    """Return the configured JWT secret, failing closed when it is missing or weak."""
    secret = get_settings().secret_key
    if len(secret) < 32:
        raise RuntimeError(
            "JWT_SECRET_KEY must be configured with at least 32 characters before auth is used"
        )
    return secret


# For backward compatibility, create the settings instance when needed
settings = get_settings()
