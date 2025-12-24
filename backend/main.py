"""Main FastAPI application for the RAG Chatbot API."""

import asyncio
from datetime import datetime
import logging
import os
import sys
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import JSONResponse

# Add the project root to Python path to allow imports
project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, project_root)

# Load environment variables first
from dotenv import load_dotenv

load_dotenv()

# Import config and get settings BEFORE importing other modules that depend on settings
from backend.config import get_settings

settings = get_settings()  # Get settings after environment is loaded

from api.analytics import router as analytics_router
from api.auth import router as auth_router
from api.conversation import router as conversation_router
from api.query import router as query_router
from api.text_selection import router as text_selection_router
from backend.db.neon_postgres import db
from services.rag_service import rag_service
from backend.utils.health_monitor import get_health_monitor, setup_default_health_checks

# Import MCP service if available
try:
    from services.mcp_service import initialize_mcp_service, shutdown_mcp_service
    MCP_AVAILABLE = True
    logger.info("MCP service module loaded successfully")
except ImportError:
    logger.info("MCP service module not found, skipping MCP initialization")
    MCP_AVAILABLE = False
    def initialize_mcp_service():
        pass
    def shutdown_mcp_service():
        pass

# Import error handling middleware
from middleware.error_handler import add_error_handling_middleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for the application."""
    logger.info("Starting up RAG Chatbot API")

    # Initialize the RAG service
    await rag_service.initialize()

    # Initialize MCP service if available
    if MCP_AVAILABLE:
        await initialize_mcp_service()
    else:
        logger.info("MCP service not available, continuing without MCP initialization")

    # Initialize health monitoring
    health_monitor = get_health_monitor()
    await setup_default_health_checks()
    health_monitor_task = asyncio.create_task(health_monitor.start_monitoring())

    yield

    logger.info("Shutting down RAG Chatbot API")

    # Stop health monitoring
    health_monitor.stop_monitoring()
    if not health_monitor_task.done():
        health_monitor_task.cancel()

    # Shutdown MCP service if available
    if MCP_AVAILABLE:
        await shutdown_mcp_service()
    else:
        logger.info("MCP service not available, skipping MCP shutdown")

    # Cleanup if needed
    await db.disconnect()


# Create FastAPI app with lifespan
app = FastAPI(
    title="RAG Chatbot API",
    description="API for Retrieval-Augmented Generation chatbot for Physical AI & Humanoid Robotics textbook",
    version="1.0.0",
    lifespan=lifespan,
)

# Add error handling middleware
add_error_handling_middleware(app)

# Include routers
app.include_router(query_router, prefix="/api", tags=["query"])
app.include_router(text_selection_router, prefix="/api", tags=["text-selection"])
app.include_router(conversation_router, prefix="", tags=["conversation"])
app.include_router(analytics_router, prefix="", tags=["analytics"])
app.include_router(auth_router, prefix="", tags=["auth"])


@app.get("/health")
async def health_check():
    """Basic health check endpoint."""
    health_monitor = get_health_monitor()
    overall_status = health_monitor.get_overall_health_status()

    return {
        "status": overall_status.value,
        "timestamp": datetime.utcnow().isoformat(),
        "dependencies": {
            "cohere_api": "connected",
            "qdrant": "connected",
            "postgres": "connected",
        },
    }


@app.get("/health/detailed")
async def detailed_health_check():
    """Detailed health check with component status."""
    health_monitor = get_health_monitor()
    overall_status = health_monitor.get_overall_health_status()

    # Get the most recent check results for each component
    detailed_results = {}
    for check_name, results in health_monitor.check_results.items():
        if results:
            latest_result = results[-1]
            detailed_results[check_name] = {
                "status": latest_result.status.value,
                "message": latest_result.message,
                "timestamp": latest_result.timestamp.isoformat(),
                "duration_ms": latest_result.duration_ms,
                "details": latest_result.details
            }

    return {
        "overall_status": overall_status.value,
        "timestamp": datetime.utcnow().isoformat(),
        "components": detailed_results,
        "consecutive_failures": health_monitor.consecutive_failures,
    }


@app.get("/health/uptime")
async def uptime_check():
    """Uptime statistics endpoint."""
    health_monitor = get_health_monitor()

    return {
        "uptime_24h": health_monitor.get_uptime_percentage(24),
        "uptime_7d": health_monitor.get_uptime_percentage(168),  # 7 days
        "uptime_30d": health_monitor.get_uptime_percentage(720),  # 30 days
        "timestamp": datetime.utcnow().isoformat(),
        "recovery_stats": health_monitor.get_recovery_time_stats(),
    }


@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Handle 404 errors."""
    return JSONResponse(
        status_code=404,
        content={
            "error": "Endpoint not found",
            "message": "The requested endpoint does not exist",
        },
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Handle 500 errors."""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app", host=settings.uvicorn_host, port=settings.uvicorn_port, reload=True
    )
