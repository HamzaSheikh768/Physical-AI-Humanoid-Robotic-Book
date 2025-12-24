"""
Comprehensive error handling utilities for the RAG Chatbot API.

Implements detailed logging and error categorization for better observability.
"""
import logging
import traceback
import sys
from datetime import datetime
from typing import Dict, Any, Optional
from enum import Enum
from dataclasses import dataclass
import json


logger = logging.getLogger(__name__)


class ErrorCategory(Enum):
    """Categories of errors for better classification and handling."""
    EXTERNAL_SERVICE_ERROR = "external_service_error"
    VALIDATION_ERROR = "validation_error"
    DATABASE_ERROR = "database_error"
    NETWORK_ERROR = "network_error"
    BUSINESS_LOGIC_ERROR = "business_logic_error"
    SYSTEM_ERROR = "system_error"
    SECURITY_ERROR = "security_error"


@dataclass
class ErrorContext:
    """Context information for error handling."""
    service: str
    operation: str
    user_id: Optional[str] = None
    request_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class DetailedErrorHandler:
    """Handles errors with detailed logging and context information."""

    def __init__(self, service_name: str):
        self.service_name = service_name
        self.logger = logging.getLogger(f"{service_name}.error_handler")

    def log_error(
        self,
        error: Exception,
        context: ErrorContext,
        category: ErrorCategory,
        level: int = logging.ERROR
    ) -> str:
        """
        Log an error with detailed context information.

        Args:
            error: The exception that occurred
            context: Context information about the error
            category: Category of the error
            level: Logging level (default ERROR)

        Returns:
            A unique error ID for tracking
        """
        error_id = f"err_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{id(error)}"

        error_details = {
            "error_id": error_id,
            "service": context.service,
            "operation": context.operation,
            "category": category.value,
            "error_type": type(error).__name__,
            "error_message": str(error),
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": context.user_id,
            "request_id": context.request_id,
            "metadata": context.metadata or {},
            "traceback": traceback.format_exception(type(error), error, error.__traceback__)
        }

        # Log the detailed error information
        self.logger.log(
            level,
            f"Error ID: {error_id} | "
            f"Service: {context.service} | "
            f"Operation: {context.operation} | "
            f"Category: {category.value} | "
            f"Error: {type(error).__name__}: {str(error)[:200]}..."
        )

        # Log full details separately for debugging
        self.logger.debug(f"Full error details: {json.dumps(error_details, default=str, indent=2)}")

        return error_id

    def handle_external_service_error(
        self,
        error: Exception,
        service_name: str,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle external service errors with specific context."""
        context = ErrorContext(
            service=service_name,
            operation=operation,
            user_id=user_id,
            request_id=request_id,
            metadata=metadata
        )
        return self.log_error(error, context, ErrorCategory.EXTERNAL_SERVICE_ERROR)

    def handle_validation_error(
        self,
        error: Exception,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle validation errors with specific context."""
        context = ErrorContext(
            service=self.service_name,
            operation=operation,
            user_id=user_id,
            request_id=request_id,
            metadata=metadata
        )
        return self.log_error(error, context, ErrorCategory.VALIDATION_ERROR)

    def handle_database_error(
        self,
        error: Exception,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle database errors with specific context."""
        context = ErrorContext(
            service=self.service_name,
            operation=operation,
            user_id=user_id,
            request_id=request_id,
            metadata=metadata
        )
        return self.log_error(error, context, ErrorCategory.DATABASE_ERROR)

    def handle_business_logic_error(
        self,
        error: Exception,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle business logic errors with specific context."""
        context = ErrorContext(
            service=self.service_name,
            operation=operation,
            user_id=user_id,
            request_id=request_id,
            metadata=metadata
        )
        return self.log_error(error, context, ErrorCategory.BUSINESS_LOGIC_ERROR)

    def handle_system_error(
        self,
        error: Exception,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle system errors with specific context."""
        context = ErrorContext(
            service=self.service_name,
            operation=operation,
            user_id=user_id,
            request_id=request_id,
            metadata=metadata
        )
        return self.log_error(error, context, ErrorCategory.SYSTEM_ERROR)


class DetailedErrorMixin:
    """Mixin to add detailed error handling to classes."""

    def __init__(self, service_name: str):
        self.error_handler = DetailedErrorHandler(service_name)

    def handle_error(
        self,
        error: Exception,
        operation: str,
        category: ErrorCategory,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle an error using the detailed error handler."""
        context = ErrorContext(
            service=self.__class__.__name__,
            operation=operation,
            user_id=user_id,
            request_id=request_id,
            metadata=metadata
        )
        return self.error_handler.log_error(error, context, category)

    def handle_external_service_error(
        self,
        error: Exception,
        operation: str,
        service_name: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle external service error with detailed logging."""
        return self.error_handler.handle_external_service_error(
            error, service_name, operation, user_id, request_id, metadata
        )

    def handle_validation_error(
        self,
        error: Exception,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle validation error with detailed logging."""
        return self.error_handler.handle_validation_error(
            error, operation, user_id, request_id, metadata
        )

    def handle_database_error(
        self,
        error: Exception,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle database error with detailed logging."""
        return self.error_handler.handle_database_error(
            error, operation, user_id, request_id, metadata
        )

    def handle_business_logic_error(
        self,
        error: Exception,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle business logic error with detailed logging."""
        return self.error_handler.handle_business_logic_error(
            error, operation, user_id, request_id, metadata
        )

    def handle_system_error(
        self,
        error: Exception,
        operation: str,
        user_id: Optional[str] = None,
        request_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """Handle system error with detailed logging."""
        return self.error_handler.handle_system_error(
            error, operation, user_id, request_id, metadata
        )


# Global error handler instance
detailed_error_handler = DetailedErrorHandler("rag-chatbot-api")


def get_error_handler() -> DetailedErrorHandler:
    """Get the global detailed error handler instance."""
    return detailed_error_handler