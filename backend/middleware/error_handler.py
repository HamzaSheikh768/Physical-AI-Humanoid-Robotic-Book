"""Error handling middleware for the RAG Chatbot API."""

import logging
import traceback
from typing import Callable, Awaitable
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """Middleware to handle errors globally across the application."""

    async def dispatch(self, request: Request, call_next: Callable) -> JSONResponse:
        """Process the request and handle any errors."""
        try:
            response = await call_next(request)
            return response
        except HTTPException as e:
            # Handle FastAPI HTTP exceptions
            logger.error(f"HTTPException occurred: {e.status_code} - {e.detail}")
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": "HTTP Exception",
                    "status_code": e.status_code,
                    "message": str(e.detail),
                    "path": str(request.url),
                    "method": request.method
                }
            )
        except StarletteHTTPException as e:
            # Handle Starlette HTTP exceptions
            logger.error(f"StarletteHTTPException occurred: {e.status_code} - {e.detail}")
            return JSONResponse(
                status_code=e.status_code,
                content={
                    "error": "HTTP Exception",
                    "status_code": e.status_code,
                    "message": str(e.detail),
                    "path": str(request.url),
                    "method": request.method
                }
            )
        except Exception as e:
            # Handle all other exceptions
            logger.error(f"Unexpected error occurred: {str(e)}")
            logger.error(traceback.format_exc())

            # Log request details for debugging
            logger.error(f"Error occurred during request: {request.method} {request.url}")

            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "status_code": 500,
                    "message": "An unexpected error occurred",
                    "path": str(request.url),
                    "method": request.method
                }
            )


async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled exceptions."""
    logger.error(f"Global exception handler caught: {str(exc)}")
    logger.error(traceback.format_exc())

    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "status_code": 500,
            "message": "An unexpected error occurred",
            "path": str(request.url),
            "method": request.method
        }
    )


def add_error_handling_middleware(app):
    """Add error handling middleware to the FastAPI application."""
    app.add_middleware(ErrorHandlingMiddleware)
    app.add_exception_handler(Exception, global_exception_handler)