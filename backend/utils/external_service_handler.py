"""
External service handler for the RAG Chatbot API.

Implements graceful degradation when external services fail.
"""
import asyncio
import logging
import time
from functools import wraps
from typing import Any, Callable, Optional, Union
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class ServiceStatus:
    """Represents the status of an external service."""
    service_name: str
    is_healthy: bool
    last_check: float
    failure_count: int
    next_retry: float
    fallback_available: bool


class ExternalServiceHandler:
    """
    Handles external service calls with graceful degradation.

    Implements circuit breaker pattern, retry logic, and fallback mechanisms.
    """

    def __init__(self, max_failures: int = 5, retry_delay: float = 60.0):
        """
        Initialize the external service handler.

        Args:
            max_failures: Maximum number of consecutive failures before circuit opens
            retry_delay: Delay in seconds before retrying failed service
        """
        self.max_failures = max_failures
        self.retry_delay = retry_delay
        self.service_status: dict[str, ServiceStatus] = {}

    def _get_service_status(self, service_name: str) -> ServiceStatus:
        """Get or create service status for the given service name."""
        if service_name not in self.service_status:
            self.service_status[service_name] = ServiceStatus(
                service_name=service_name,
                is_healthy=True,
                last_check=time.time(),
                failure_count=0,
                next_retry=0,
                fallback_available=True
            )
        return self.service_status[service_name]

    def _should_attempt_call(self, service_name: str) -> bool:
        """Check if we should attempt to call the service based on circuit breaker state."""
        status = self._get_service_status(service_name)

        # If we're in retry period, don't attempt the call
        if time.time() < status.next_retry:
            return False

        return True

    def _record_success(self, service_name: str):
        """Record a successful service call."""
        status = self._get_service_status(service_name)
        status.is_healthy = True
        status.failure_count = 0
        status.last_check = time.time()
        logger.info(f"Service {service_name} call succeeded")

    def _record_failure(self, service_name: str):
        """Record a failed service call and update circuit breaker state."""
        status = self._get_service_status(service_name)
        status.is_healthy = False
        status.failure_count += 1
        status.last_check = time.time()

        # If we've exceeded max failures, set next retry time
        if status.failure_count >= self.max_failures:
            status.next_retry = time.time() + self.retry_delay
            logger.warning(
                f"Circuit breaker opened for {service_name}. "
                f"Will retry after {self.retry_delay}s. Failure count: {status.failure_count}"
            )
        else:
            logger.warning(
                f"Service {service_name} failed. Failure count: {status.failure_count}"
            )

    def call_with_fallback(
        self,
        service_name: str,
        primary_func: Callable,
        fallback_func: Optional[Callable] = None,
        *args,
        **kwargs
    ) -> Any:
        """
        Call a primary function with fallback option.

        Args:
            service_name: Name of the external service
            primary_func: Primary function to call
            fallback_func: Fallback function to call if primary fails
            *args: Arguments for the functions
            **kwargs: Keyword arguments for the functions

        Returns:
            Result from primary or fallback function
        """
        # Check if we should attempt the call
        if not self._should_attempt_call(service_name):
            status = self._get_service_status(service_name)
            logger.warning(
                f"Skipping call to {service_name} due to circuit breaker. "
                f"Will retry after {status.next_retry - time.time():.2f}s"
            )

            # Use fallback if available
            if fallback_func:
                logger.info(f"Using fallback for {service_name}")
                return fallback_func(*args, **kwargs)
            else:
                raise Exception(f"Service {service_name} is temporarily unavailable")

        try:
            result = primary_func(*args, **kwargs)
            self._record_success(service_name)
            return result
        except Exception as e:
            logger.error(f"Primary call to {service_name} failed: {e}")
            self._record_failure(service_name)

            # Try fallback if available
            if fallback_func:
                logger.info(f"Attempting fallback for {service_name}")
                try:
                    result = fallback_func(*args, **kwargs)
                    logger.info(f"Fallback for {service_name} succeeded")
                    return result
                except Exception as fallback_error:
                    logger.error(f"Fallback for {service_name} also failed: {fallback_error}")
                    raise Exception(
                        f"Both primary and fallback for {service_name} failed: {e}, {fallback_error}"
                    )
            else:
                raise e

    async def async_call_with_fallback(
        self,
        service_name: str,
        primary_func: Callable,
        fallback_func: Optional[Callable] = None,
        *args,
        **kwargs
    ) -> Any:
        """
        Async version of call_with_fallback.

        Args:
            service_name: Name of the external service
            primary_func: Primary async function to call
            fallback_func: Fallback async function to call if primary fails
            *args: Arguments for the functions
            **kwargs: Keyword arguments for the functions

        Returns:
            Result from primary or fallback function
        """
        # Check if we should attempt the call
        if not self._should_attempt_call(service_name):
            status = self._get_service_status(service_name)
            logger.warning(
                f"Skipping async call to {service_name} due to circuit breaker. "
                f"Will retry after {status.next_retry - time.time():.2f}s"
            )

            # Use fallback if available
            if fallback_func:
                logger.info(f"Using async fallback for {service_name}")
                return await fallback_func(*args, **kwargs)
            else:
                raise Exception(f"Service {service_name} is temporarily unavailable")

        try:
            result = await primary_func(*args, **kwargs)
            self._record_success(service_name)
            return result
        except Exception as e:
            logger.error(f"Primary async call to {service_name} failed: {e}")
            self._record_failure(service_name)

            # Try fallback if available
            if fallback_func:
                logger.info(f"Attempting async fallback for {service_name}")
                try:
                    result = await fallback_func(*args, **kwargs)
                    logger.info(f"Async fallback for {service_name} succeeded")
                    return result
                except Exception as fallback_error:
                    logger.error(f"Async fallback for {service_name} also failed: {fallback_error}")
                    raise Exception(
                        f"Both primary and fallback for {service_name} failed: {e}, {fallback_error}"
                    )
            else:
                raise e


def with_external_service_fallback(
    service_name: str,
    fallback_func: Optional[Callable] = None,
    handler: Optional[ExternalServiceHandler] = None
):
    """
    Decorator to wrap functions with external service handling.

    Args:
        service_name: Name of the external service
        fallback_func: Fallback function to call if primary fails
        handler: ExternalServiceHandler instance to use (creates default if None)
    """
    if handler is None:
        handler = ExternalServiceHandler()

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            return handler.call_with_fallback(
                service_name, func, fallback_func, *args, **kwargs
            )
        return wrapper

    def async_decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            return await handler.async_call_with_fallback(
                service_name, func, fallback_func, *args, **kwargs
            )
        return wrapper

    # Return the appropriate decorator based on function type
    if asyncio.iscoroutinefunction(func):
        return async_decorator(func)
    else:
        return decorator(func)

    return decorator


# Global instance
external_service_handler = ExternalServiceHandler(max_failures=3, retry_delay=300.0)  # 5 min retry


def get_external_service_handler() -> ExternalServiceHandler:
    """Get the global external service handler instance."""
    return external_service_handler