"""Cohere embedding service for the RAG Chatbot API."""

import logging
import hashlib
import math
from typing import Any, Dict, List

import cohere

from backend.config import get_settings
from backend.utils.exceptions import EmbeddingGenerationError

logger = logging.getLogger(__name__)


class CohereEmbeddingService:
    """Service class to handle Cohere embedding operations."""

    def __init__(self):
        settings = get_settings()
        self.client = cohere.Client(settings.cohere_api_key)
        self.model = settings.cohere_model

    @staticmethod
    def _test_embedding(text: str, dimensions: int = 1024) -> List[float]:
        """Create a stable local vector for isolated test environments."""
        values: List[float] = []
        seed = text.encode("utf-8")
        counter = 0
        while len(values) < dimensions:
            digest = hashlib.sha256(seed + counter.to_bytes(4, "big")).digest()
            values.extend((byte / 127.5) - 1.0 for byte in digest)
            counter += 1
        vector = values[:dimensions]
        norm = math.sqrt(sum(value * value for value in vector)) or 1.0
        return [value / norm for value in vector]

    @staticmethod
    def _is_test_environment() -> bool:
        return get_settings().environment.lower() in {"test", "testing"}

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts using Cohere."""
        try:
            if self._is_test_environment():
                return [self._test_embedding(text) for text in texts]
            response = self.client.embed(
                texts=texts,
                model=self.model,
                input_type="search_document",  # Using search_document as default for content
            )
            return [embedding for embedding in response.embeddings]
        except Exception as e:
            logger.error(f"Failed to generate embeddings with Cohere: {e}")
            raise EmbeddingGenerationError(f"Failed to generate embeddings: {str(e)}")

    def generate_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for a single query using Cohere."""
        try:
            if self._is_test_environment():
                return self._test_embedding(query)
            response = self.client.embed(
                texts=[query],
                model=self.model,
                input_type="search_query",  # Using search_query for queries
            )
            return response.embeddings[0]
        except Exception as e:
            logger.error(f"Failed to generate query embedding with Cohere: {e}")
            raise EmbeddingGenerationError(
                f"Failed to generate query embedding: {str(e)}"
            )

    def embed_text_chunks(
        self, text_chunks: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate embeddings for text chunks and return with metadata."""
        try:
            # Extract just the text content for embedding
            texts = [chunk["text"] for chunk in text_chunks]
            embeddings = self.generate_embeddings(texts)

            # Combine embeddings with original metadata
            result = []
            for i, chunk in enumerate(text_chunks):
                chunk_with_embedding = chunk.copy()
                chunk_with_embedding["embedding"] = embeddings[i]
                result.append(chunk_with_embedding)

            return result
        except Exception as e:
            logger.error(f"Failed to embed text chunks: {e}")
            raise EmbeddingGenerationError(f"Failed to embed text chunks: {str(e)}")

    def calculate_similarity(
        self, embedding1: List[float], embedding2: List[float]
    ) -> float:
        """Calculate cosine similarity between two embeddings."""
        import numpy as np

        # Convert to numpy arrays
        v1 = np.array(embedding1)
        v2 = np.array(embedding2)

        # Calculate cosine similarity
        dot_product = np.dot(v1, v2)
        norm_v1 = np.linalg.norm(v1)
        norm_v2 = np.linalg.norm(v2)

        if norm_v1 == 0 or norm_v2 == 0:
            return 0.0

        return float(dot_product / (norm_v1 * norm_v2))

    async def generate_embedding(
        self,
        text: str,
        model_name: str = "embed-multilingual-v2.0",
        input_type: str = "search_document",
    ) -> List[float]:
        """Async wrapper for generating a single embedding."""
        import asyncio

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None, self._generate_single_embedding, text, model_name, input_type
        )

    def _generate_single_embedding(
        self,
        text: str,
        model_name: str = "embed-multilingual-v2.0",
        input_type: str = "search_document",
    ) -> List[float]:
        """Internal synchronous method to generate a single embedding."""
        try:
            if self._is_test_environment():
                return self._test_embedding(text)
            model = model_name or self.model
            response = self.client.embed(
                texts=[text],
                model=model,
                input_type=input_type,
            )
            return response.embeddings[0]
        except Exception as e:
            logger.error(f"Failed to generate single embedding with Cohere: {e}")
            raise EmbeddingGenerationError(
                f"Failed to generate single embedding: {str(e)}"
            )

    async def generate_embeddings_batch(
        self,
        texts: List[str],
        model_name: str = "embed-multilingual-v2.0",
        input_type: str = "search_document",
    ) -> List[List[float]]:
        """Async wrapper for generating embeddings batch."""
        import asyncio

        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            None, self._generate_embeddings_batch, texts, model_name, input_type
        )

    def _generate_embeddings_batch(
        self,
        texts: List[str],
        model_name: str = "embed-multilingual-v2.0",
        input_type: str = "search_document",
    ) -> List[List[float]]:
        """Internal synchronous method to generate embeddings batch."""
        try:
            if self._is_test_environment():
                return [self._test_embedding(text) for text in texts]
            model = model_name or self.model
            response = self.client.embed(
                texts=texts,
                model=model,
                input_type=input_type,
            )
            return [embedding for embedding in response.embeddings]
        except Exception as e:
            logger.error(f"Failed to generate embeddings batch with Cohere: {e}")
            raise EmbeddingGenerationError(
                f"Failed to generate embeddings batch: {str(e)}"
            )


# Global instance
class _CohereServiceProvider:
    def __init__(self):
        self._instance = None

    def __getattr__(self, name):
        if self._instance is None:
            self._instance = CohereEmbeddingService()
        return getattr(self._instance, name)

    def __setattr__(self, name, value):
        if name.startswith("_"):
            super().__setattr__(name, value)
        else:
            if self._instance is None:
                self._instance = CohereEmbeddingService()
            setattr(self._instance, name, value)

    def __delattr__(self, name):
        """Delegate attribute cleanup so mocks can safely restore patched methods."""
        if name.startswith("_"):
            super().__delattr__(name)
        elif self._instance is not None:
            delattr(self._instance, name)


cohere_service = _CohereServiceProvider()
