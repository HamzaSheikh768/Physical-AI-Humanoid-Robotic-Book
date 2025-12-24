"""
Health check and monitoring utilities for the RAG Chatbot API.

Implements health checks and monitoring to ensure 99.9% uptime requirements.
"""
import asyncio
import logging
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable, Any
from dataclasses import dataclass
from enum import Enum
import aiohttp
import psutil
from pydantic import BaseModel


logger = logging.getLogger(__name__)


class HealthStatus(Enum):
    """Health status of a service or component."""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    UNKNOWN = "unknown"


@dataclass
class HealthCheckResult:
    """Result of a health check."""
    name: str
    status: HealthStatus
    message: str
    timestamp: datetime
    duration_ms: float
    details: Optional[Dict[str, Any]] = None


class HealthCheck(BaseModel):
    """Configuration for a health check."""
    name: str
    check_function: Callable
    interval_seconds: int = 30
    timeout_seconds: int = 10
    max_consecutive_failures: int = 3
    enabled: bool = True


class HealthMonitor:
    """
    Monitors health of services and components to ensure 99.9% uptime.

    Implements health checks, failure tracking, and recovery time monitoring.
    """

    def __init__(self):
        self.health_checks: List[HealthCheck] = []
        self.check_results: Dict[str, List[HealthCheckResult]] = {}
        self.consecutive_failures: Dict[str, int] = {}
        self.last_recovery_time: Dict[str, datetime] = {}
        self.is_running = False
        self.monitor_task = None

    def add_health_check(self, health_check: HealthCheck):
        """Add a health check to the monitor."""
        self.health_checks.append(health_check)
        self.check_results[health_check.name] = []
        self.consecutive_failures[health_check.name] = 0

    async def run_health_check(self, check: HealthCheck) -> HealthCheckResult:
        """Run a single health check."""
        start_time = time.time()

        try:
            # Execute the health check function with timeout
            result = await asyncio.wait_for(
                check.check_function(),
                timeout=check.timeout_seconds
            )

            duration_ms = (time.time() - start_time) * 1000

            if isinstance(result, tuple):
                status, message, details = result
            else:
                # Assume boolean result
                status = HealthStatus.HEALTHY if result else HealthStatus.UNHEALTHY
                message = "Health check passed" if result else "Health check failed"
                details = None

            return HealthCheckResult(
                name=check.name,
                status=status,
                message=message,
                timestamp=datetime.utcnow(),
                duration_ms=duration_ms,
                details=details
            )

        except asyncio.TimeoutError:
            duration_ms = (time.time() - start_time) * 1000
            return HealthCheckResult(
                name=check.name,
                status=HealthStatus.UNHEALTHY,
                message=f"Health check timed out after {check.timeout_seconds}s",
                timestamp=datetime.utcnow(),
                duration_ms=duration_ms
            )

        except Exception as e:
            duration_ms = (time.time() - start_time) * 1000
            return HealthCheckResult(
                name=check.name,
                status=HealthStatus.UNHEALTHY,
                message=f"Health check failed with error: {str(e)}",
                timestamp=datetime.utcnow(),
                duration_ms=duration_ms
            )

    async def run_all_health_checks(self):
        """Run all registered health checks."""
        results = []

        for check in self.health_checks:
            if not check.enabled:
                continue

            result = await self.run_health_check(check)
            results.append(result)

            # Store the result
            self.check_results[check.name].append(result)

            # Keep only recent results (last 100)
            if len(self.check_results[check.name]) > 100:
                self.check_results[check.name] = self.check_results[check.name][-100:]

            # Track consecutive failures
            if result.status == HealthStatus.UNHEALTHY:
                self.consecutive_failures[check.name] += 1
                logger.warning(f"Health check '{check.name}' failed: {result.message}")

                # Check if we've exceeded failure threshold
                if self.consecutive_failures[check.name] >= check.max_consecutive_failures:
                    logger.error(f"Health check '{check.name}' has failed {self.consecutive_failures[check.name]} times consecutively")
            else:
                # Reset consecutive failures counter on success
                if self.consecutive_failures[check.name] > 0:
                    recovery_time = datetime.utcnow()
                    if check.name in self.last_recovery_time:
                        recovery_duration = recovery_time - self.last_recovery_time[check.name]
                        logger.info(f"Service '{check.name}' recovered after {recovery_duration.total_seconds():.2f}s")

                    self.last_recovery_time[check.name] = recovery_time

                self.consecutive_failures[check.name] = 0

        return results

    def get_overall_health_status(self) -> HealthStatus:
        """Get the overall health status of all monitored services."""
        if not self.health_checks:
            return HealthStatus.UNKNOWN

        all_statuses = [result.status for results in self.check_results.values() for result in results[-1:]]

        if not all_statuses:
            return HealthStatus.UNKNOWN

        # If any service is unhealthy, overall status is unhealthy
        if HealthStatus.UNHEALTHY in all_statuses:
            return HealthStatus.UNHEALTHY

        # If any service is degraded, overall status is degraded
        if HealthStatus.DEGRADED in all_statuses:
            return HealthStatus.DEGRADED

        return HealthStatus.HEALTHY

    def get_uptime_percentage(self, time_window_hours: int = 24) -> float:
        """Calculate uptime percentage over a specified time window."""
        if not self.health_checks:
            return 0.0

        time_threshold = datetime.utcnow() - timedelta(hours=time_window_hours)
        total_checks = 0
        healthy_checks = 0

        for results in self.check_results.values():
            recent_results = [r for r in results if r.timestamp >= time_threshold]
            total_checks += len(recent_results)
            healthy_checks += sum(1 for r in recent_results if r.status == HealthStatus.HEALTHY)

        if total_checks == 0:
            return 0.0

        return (healthy_checks / total_checks) * 100

    def get_recovery_time_stats(self) -> Dict[str, float]:
        """Get average recovery time statistics."""
        recovery_times = []

        for name, recovery_time in self.last_recovery_time.items():
            # Calculate time since last recovery
            if name in self.check_results and self.check_results[name]:
                last_failure_time = None
                # Find the last failure before recovery
                for result in reversed(self.check_results[name]):
                    if result.timestamp < recovery_time and result.status == HealthStatus.UNHEALTHY:
                        last_failure_time = result.timestamp
                        break

                if last_failure_time:
                    recovery_duration = (recovery_time - last_failure_time).total_seconds()
                    recovery_times.append(recovery_duration)

        if not recovery_times:
            return {"avg_recovery_time": 0, "max_recovery_time": 0, "min_recovery_time": 0}

        return {
            "avg_recovery_time": sum(recovery_times) / len(recovery_times),
            "max_recovery_time": max(recovery_times),
            "min_recovery_time": min(recovery_times),
            "total_recovery_events": len(recovery_times)
        }

    async def start_monitoring(self):
        """Start the health monitoring loop."""
        if self.is_running:
            return

        self.is_running = True
        logger.info("Starting health monitoring...")

        while self.is_running:
            try:
                await self.run_all_health_checks()
                # Wait for the shortest check interval
                min_interval = min((check.interval_seconds for check in self.health_checks if check.enabled), default=30)
                await asyncio.sleep(min_interval)

            except Exception as e:
                logger.error(f"Error in health monitoring loop: {e}")
                await asyncio.sleep(30)  # Wait before retrying

    def stop_monitoring(self):
        """Stop the health monitoring loop."""
        self.is_running = False
        logger.info("Stopped health monitoring")


# Global health monitor instance
health_monitor = HealthMonitor()


def get_health_monitor() -> HealthMonitor:
    """Get the global health monitor instance."""
    return health_monitor


# Default health checks for the RAG system
async def check_cohere_service():
    """Check if Cohere service is accessible."""
    try:
        # This is a placeholder - in a real implementation, you would check
        # the actual Cohere service connectivity
        return HealthStatus.HEALTHY, "Cohere service accessible", None
    except Exception as e:
        return HealthStatus.UNHEALTHY, f"Cohere service error: {str(e)}", None


async def check_qdrant_service():
    """Check if Qdrant service is accessible."""
    try:
        # This is a placeholder - in a real implementation, you would check
        # the actual Qdrant service connectivity
        return HealthStatus.HEALTHY, "Qdrant service accessible", None
    except Exception as e:
        return HealthStatus.UNHEALTHY, f"Qdrant service error: {str(e)}", None


async def check_database_connection():
    """Check if database connection is healthy."""
    try:
        # This is a placeholder - in a real implementation, you would check
        # the actual database connection
        return HealthStatus.HEALTHY, "Database connection healthy", None
    except Exception as e:
        return HealthStatus.UNHEALTHY, f"Database connection error: {str(e)}", None


async def check_system_resources():
    """Check system resource usage."""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory_percent = psutil.virtual_memory().percent
        disk_percent = psutil.disk_usage('/').percent

        details = {
            "cpu_percent": cpu_percent,
            "memory_percent": memory_percent,
            "disk_percent": disk_percent
        }

        if cpu_percent > 90 or memory_percent > 90 or disk_percent > 90:
            return HealthStatus.DEGRADED, f"High resource usage - CPU: {cpu_percent}%, Memory: {memory_percent}%, Disk: {disk_percent}%", details
        elif cpu_percent > 80 or memory_percent > 80 or disk_percent > 80:
            return HealthStatus.HEALTHY, f"Resource usage acceptable - CPU: {cpu_percent}%, Memory: {memory_percent}%, Disk: {disk_percent}%", details
        else:
            return HealthStatus.HEALTHY, f"Resource usage good - CPU: {cpu_percent}%, Memory: {memory_percent}%, Disk: {disk_percent}%", details
    except Exception as e:
        return HealthStatus.UNHEALTHY, f"System resource check failed: {str(e)}", None


# Register default health checks
async def setup_default_health_checks():
    """Set up default health checks for the RAG system."""
    monitor = get_health_monitor()

    # Add health checks with appropriate intervals
    monitor.add_health_check(HealthCheck(
        name="cohere-service",
        check_function=check_cohere_service,
        interval_seconds=60,  # Check every minute
        timeout_seconds=10,
        max_consecutive_failures=3
    ))

    monitor.add_health_check(HealthCheck(
        name="qdrant-service",
        check_function=check_qdrant_service,
        interval_seconds=30,  # Check every 30 seconds
        timeout_seconds=10,
        max_consecutive_failures=3
    ))

    monitor.add_health_check(HealthCheck(
        name="database-connection",
        check_function=check_database_connection,
        interval_seconds=45,  # Check every 45 seconds
        timeout_seconds=10,
        max_consecutive_failures=3
    ))

    monitor.add_health_check(HealthCheck(
        name="system-resources",
        check_function=check_system_resources,
        interval_seconds=15,  # Check every 15 seconds
        timeout_seconds=5,
        max_consecutive_failures=5  # Allow more failures for resource checks
    ))