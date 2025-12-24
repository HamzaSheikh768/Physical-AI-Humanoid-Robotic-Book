import os
from typing import Optional
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Cohere API settings
    cohere_api_key: str = Field(..., description="Cohere API key for embeddings")

    # Qdrant settings
    qdrant_url: str = Field(..., description="Qdrant cluster URL")
    qdrant_api_key: str = Field(..., description="Qdrant API key")

    # MCP Server settings (optional)
    mcp_server_url: Optional[str] = Field(None, description="Context7 MCP server URL")

    # Application settings
    app_name: str = "RAG Backend Service"
    debug: bool = False
    environment: str = "development"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

def get_settings() -> Settings:
    """Get application settings with validation."""
    settings = Settings()

    # Validate that required environment variables are set
    if not settings.cohere_api_key or settings.cohere_api_key == "your_cohere_api_key_here":
        raise ValueError("COHERE_API_KEY environment variable is not set or is the default placeholder value")

    if not settings.qdrant_url or settings.qdrant_url == "your_qdrant_cluster_url_here":
        raise ValueError("QDRANT_URL environment variable is not set or is the default placeholder value")

    if not settings.qdrant_api_key or settings.qdrant_api_key == "your_qdrant_api_key_here":
        raise ValueError("QDRANT_API_KEY environment variable is not set or is the default placeholder value")

    return settings

# Global settings instance
settings = get_settings()

if __name__ == "__main__":
    # Test configuration loading
    print("Configuration loaded successfully:")
    print(f"App Name: {settings.app_name}")
    print(f"Environment: {settings.environment}")
    print(f"Cohere API Key set: {'Yes' if settings.cohere_api_key else 'No'}")
    print(f"Qdrant URL: {settings.qdrant_url}")
    print(f"MCP Server URL: {settings.mcp_server_url if settings.mcp_server_url else 'Not configured'}")