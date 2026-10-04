"""Logging utilities for the RAG Chatbot API."""

import logging
from typing import Optional


class RAGLogger:
    """Custom logger for RAG-specific operations."""

    def __init__(self, name: str = "rag_logger"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)

        # Create handler if not already configured
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def log_query(self, query_id: str, query_text: str, user_id: Optional[str] = None):
        """Log query information."""
        self.logger.info(
            f"Query received - ID: {query_id}, User: {user_id or 'unknown'}, Text: {query_text[:100]}..."
        )

    def log_response(self, response_id: str, query_id: str, confidence_score: float):
        """Log response information."""
        self.logger.info(
            f"Response generated - ID: {response_id}, Query: {query_id}, Confidence: {confidence_score}"
        )

    def log_embedding_process(self, content_id: str, status: str):
        """Log embedding process information."""
        self.logger.info(f"Embedding process - Content: {content_id}, Status: {status}")

    def log_embedding_generation(self, text: str, model_name: str):
        """Log a single embedding generation."""
        self.logger.info(
            f"Embedding generated - Model: {model_name}, Text: {text[:100]}"
        )

    def log_embedding_generation_batch(self, count: int, model_name: str):
        """Log a batch embedding generation."""
        self.logger.info(f"Embeddings generated - Count: {count}, Model: {model_name}")

    def log_embedding_storage(
        self, embedding_id: str, content_id: str, model_name: str
    ):
        """Log an embedding stored in the vector database."""
        self.logger.info(
            f"Embedding stored - ID: {embedding_id}, Content: {content_id}, Model: {model_name}"
        )

    def log_content_embedding(self, content_id: str, chunk_count: int):
        """Log embeddings generated for a content item."""
        self.logger.info(
            f"Content embeddings generated - Content: {content_id}, Chunks: {chunk_count}"
        )

    def log_embedding_retrieval(self, result_count: int, top_k: int):
        """Log an embedding similarity retrieval."""
        self.logger.info(
            f"Embeddings retrieved - Results: {result_count}, Requested: {top_k}"
        )

    def log_content_processing_start(
        self, content_id: str, title: str, text_length: int
    ):
        """Log the start of content processing."""
        self.logger.info(
            f"Content processing started - ID: {content_id}, Title: {title}, Length: {text_length}"
        )

    def log_content_processing_complete(self, content_id: str, embedding_count: int):
        """Log successful content processing."""
        self.logger.info(
            f"Content processing complete - ID: {content_id}, Embeddings: {embedding_count}"
        )

    def log_content_processing_error(
        self, content_id: str, error_type: str, error_message: str
    ):
        """Log a content processing error."""
        self.logger.error(
            f"Content processing failed - ID: {content_id}, Type: {error_type}, Error: {error_message}"
        )

    def log_content_batch_processing(
        self, total_count: int, successful_count: int, failed_count: int
    ):
        """Log a content batch processing summary."""
        self.logger.info(
            f"Content batch processed - Total: {total_count}, Successful: {successful_count}, Failed: {failed_count}"
        )

    def log_content_indexing(
        self,
        content_id: str,
        embedding_count: int,
        status: str,
        error_message: Optional[str] = None,
    ):
        """Log content indexing progress."""
        self.logger.info(
            f"Content indexing - ID: {content_id}, Embeddings: {embedding_count}, "
            f"Status: {status}, Error: {error_message or 'none'}"
        )

    def log_batch_indexing(
        self, total_count: int, successful_count: int, failed_count: int
    ):
        """Log a content indexing batch summary."""
        self.logger.info(
            f"Batch indexing - Total: {total_count}, Successful: {successful_count}, Failed: {failed_count}"
        )

    def log_content_reindexing(
        self,
        content_id: str,
        embedding_count: int,
        status: str,
        error_message: Optional[str] = None,
    ):
        """Log content reindexing progress."""
        self.logger.info(
            f"Content reindexing - ID: {content_id}, Embeddings: {embedding_count}, "
            f"Status: {status}, Error: {error_message or 'none'}"
        )

    def log_error(
        self, error_type: str, error_message: str, query_id: Optional[str] = None
    ):
        """Log error information."""
        query_info = f", Query: {query_id}" if query_id else ""
        self.logger.error(
            f"Error - Type: {error_type}, Message: {error_message}{query_info}"
        )

    def log_api_call(
        self, endpoint: str, method: str, duration: float, status_code: int
    ):
        """Log API call information."""
        self.logger.info(
            f"API Call - {method} {endpoint}, Duration: {duration:.3f}s, Status: {status_code}"
        )


# Create a global instance
rag_logger = RAGLogger()
