"""Cohere embedding service for the RAG Chatbot API."""

import logging
from typing import Any, Dict, List

import cohere

from backend.config import get_settings
from backend.utils.caching import embedding_cache
from backend.utils.exceptions import EmbeddingGenerationError
from backend.utils.external_service_handler import external_service_handler
from backend.utils.detailed_error_handler import DetailedErrorMixin, ErrorCategory

logger = logging.getLogger(__name__)


class CohereEmbeddingService(DetailedErrorMixin):
    """Service class to handle Cohere embedding operations."""

    def __init__(self):
        settings = get_settings()
        self.client = cohere.Client(settings.cohere_api_key)
        self.model = settings.cohere_model
        # Initialize the detailed error handler
        super().__init__("cohere-embedding-service")

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts using Cohere."""
        def _generate_embeddings_primary(texts: List[str]) -> List[List[float]]:
            try:
                # Check cache for each text
                embeddings = []
                uncached_texts = []
                uncached_indices = []

                for i, text in enumerate(texts):
                    cached_embedding = embedding_cache.get(text, self.model)
                    if cached_embedding:
                        embeddings.append(cached_embedding)
                        logger.info(f"Using cached embedding for text: {text[:50]}...")
                    else:
                        embeddings.append(None)  # Placeholder
                        uncached_texts.append(text)
                        uncached_indices.append(i)
                        logger.info(f"Will generate embedding for uncached text: {text[:50]}...")

                # Generate embeddings for uncached texts
                if uncached_texts:
                    logger.info(f"Generating embeddings for {len(uncached_texts)} uncached texts")
                    response = self.client.embed(
                        texts=uncached_texts,
                        model=self.model,
                        input_type="search_document",  # Using search_document as default for content
                    )
                    new_embeddings = [embedding for embedding in response.embeddings]

                    # Validate that all new embeddings have the correct dimension (1024 for embed-multilingual-v3.0)
                    for j, embedding in enumerate(new_embeddings):
                        if len(embedding) != 1024:
                            raise EmbeddingGenerationError(
                                f"Generated embedding {j} has dimension {len(embedding)}, expected 1024 for model {self.model}"
                            )

                        # Cache the new embedding
                        embedding_cache.set(uncached_texts[j], embedding, self.model)

                    # Place the new embeddings in the right positions
                    for idx, new_embedding in zip(uncached_indices, new_embeddings):
                        embeddings[idx] = new_embedding

                logger.info(f"Successfully generated {len(embeddings)} embeddings with dimension 1024 using model {self.model}")
                return embeddings
            except Exception as e:
                error_id = self.handle_external_service_error(
                    e,
                    "generate_embeddings",
                    "cohere-api",
                    metadata={
                        "batch_size": len(texts),
                        "model": self.model
                    }
                )
                logger.error(f"Failed to generate embeddings with Cohere (Error ID: {error_id}): {e}")
                raise EmbeddingGenerationError(f"Failed to generate embeddings: {str(e)}")

        def _generate_embeddings_fallback(texts: List[str]) -> List[List[float]]:
            """Fallback method that returns zero vectors when Cohere fails."""
            logger.warning(f"Using fallback embeddings for {len(texts)} texts")
            # Return zero vectors as fallback (this will result in poor similarity matches)
            # but allows the system to continue operating
            fallback_embeddings = []
            for i, text in enumerate(texts):
                # Create a zero vector of 1024 dimensions
                zero_embedding = [0.0] * 1024
                fallback_embeddings.append(zero_embedding)
                # Still cache the fallback embedding to avoid repeated fallback calls
                embedding_cache.set(text, zero_embedding, self.model)
            return fallback_embeddings

        # Use external service handler with fallback
        return external_service_handler.call_with_fallback(
            "cohere-embeddings",
            _generate_embeddings_primary,
            _generate_embeddings_fallback,
            texts
        )

    def generate_query_embedding(self, query: str) -> List[float]:
        """Generate embedding for a single query using Cohere."""
        def _generate_query_embedding_primary(query: str) -> List[float]:
            try:
                # Check if embedding is already cached
                cached_embedding = embedding_cache.get(query, self.model)
                if cached_embedding:
                    logger.info(f"Using cached embedding for query: {query[:50]}...")
                    return cached_embedding

                logger.info(f"Generating new embedding for query: {query[:50]}...")

                response = self.client.embed(
                    texts=[query],
                    model=self.model,
                    input_type="search_query",  # Using search_query for queries
                )
                embedding = response.embeddings[0]

                # Validate that the embedding has the correct dimension (1024 for embed-multilingual-v3.0)
                if len(embedding) != 1024:
                    raise EmbeddingGenerationError(
                        f"Generated query embedding has dimension {len(embedding)}, expected 1024 for model {self.model}"
                    )

                # Cache the new embedding
                embedding_cache.set(query, embedding, self.model)

                logger.info(f"Successfully generated query embedding with dimension 1024 using model {self.model}")
                return embedding
            except Exception as e:
                error_id = self.handle_external_service_error(
                    e,
                    "generate_query_embedding",
                    "cohere-api",
                    metadata={
                        "query_length": len(query),
                        "model": self.model
                    }
                )
                logger.error(f"Failed to generate query embedding with Cohere (Error ID: {error_id}): {e}")
                raise EmbeddingGenerationError(
                    f"Failed to generate query embedding: {str(e)}"
                )

        def _generate_query_embedding_fallback(query: str) -> List[float]:
            """Fallback method that returns zero vector when Cohere fails."""
            logger.warning(f"Using fallback embedding for query: {query[:50]}...")
            # Return zero vector as fallback (this will result in poor similarity matches)
            # but allows the system to continue operating
            zero_embedding = [0.0] * 1024
            # Still cache the fallback embedding to avoid repeated fallback calls
            embedding_cache.set(query, zero_embedding, self.model)
            return zero_embedding

        # Use external service handler with fallback
        return external_service_handler.call_with_fallback(
            "cohere-query-embeddings",
            _generate_query_embedding_primary,
            _generate_query_embedding_fallback,
            query
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
            error_id = self.handle_business_logic_error(
                e,
                "embed_text_chunks",
                metadata={
                    "chunk_count": len(text_chunks)
                }
            )
            logger.error(f"Failed to embed text chunks (Error ID: {error_id}): {e}")
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
        model_name: str = "embed-multilingual-v3.0",
        input_type: str = "search_document",
    ) -> List[float]:
        """Internal synchronous method to generate a single embedding."""
        def _generate_single_embedding_primary(
            text: str,
            model_name: str = "embed-multilingual-v3.0",
            input_type: str = "search_document",
        ) -> List[float]:
            try:
                model = model_name or self.model

                # Check if embedding is already cached
                cached_embedding = embedding_cache.get(text, model)
                if cached_embedding:
                    logger.info(f"Using cached embedding for text: {text[:50]}...")
                    return cached_embedding

                logger.info(f"Generating new embedding for text: {text[:50]}...")

                response = self.client.embed(
                    texts=[text],
                    model=model,
                    input_type=input_type,
                )
                embedding = response.embeddings[0]

                # Validate that the embedding has the correct dimension (1024 for embed-multilingual-v3.0)
                if len(embedding) != 1024:
                    raise EmbeddingGenerationError(
                        f"Generated single embedding has dimension {len(embedding)}, expected 1024 for model {model}"
                    )

                # Cache the new embedding
                embedding_cache.set(text, embedding, model)

                logger.info(f"Successfully generated single embedding with dimension 1024 using model {model}")
                return embedding
            except Exception as e:
                error_id = self.handle_external_service_error(
                    e,
                    "generate_single_embedding",
                    "cohere-api",
                    metadata={
                        "text_length": len(text),
                        "model": model,
                        "input_type": input_type
                    }
                )
                logger.error(f"Failed to generate single embedding with Cohere (Error ID: {error_id}): {e}")
                raise EmbeddingGenerationError(
                    f"Failed to generate single embedding: {str(e)}"
                )

        def _generate_single_embedding_fallback(
            text: str,
            model_name: str = "embed-multilingual-v3.0",
            input_type: str = "search_document",
        ) -> List[float]:
            """Fallback method that returns zero vector when Cohere fails."""
            logger.warning(f"Using fallback embedding for text: {text[:50]}...")
            # Return zero vector as fallback (this will result in poor similarity matches)
            # but allows the system to continue operating
            zero_embedding = [0.0] * 1024
            model = model_name or self.model
            # Still cache the fallback embedding to avoid repeated fallback calls
            embedding_cache.set(text, zero_embedding, model)
            return zero_embedding

        # Use external service handler with fallback
        return external_service_handler.call_with_fallback(
            "cohere-single-embedding",
            _generate_single_embedding_primary,
            _generate_single_embedding_fallback,
            text, model_name, input_type
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
        model_name: str = "embed-multilingual-v3.0",
        input_type: str = "search_document",
    ) -> List[List[float]]:
        """Internal synchronous method to generate embeddings batch."""
        def _generate_embeddings_batch_primary(
            texts: List[str],
            model_name: str = "embed-multilingual-v3.0",
            input_type: str = "search_document",
        ) -> List[List[float]]:
            try:
                model = model_name or self.model

                # Check cache for each text
                embeddings = []
                uncached_texts = []
                uncached_indices = []

                for i, text in enumerate(texts):
                    cached_embedding = embedding_cache.get(text, model)
                    if cached_embedding:
                        embeddings.append(cached_embedding)
                        logger.info(f"Using cached embedding for text: {text[:50]}...")
                    else:
                        embeddings.append(None)  # Placeholder
                        uncached_texts.append(text)
                        uncached_indices.append(i)
                        logger.info(f"Will generate embedding for uncached text: {text[:50]}...")

                # Generate embeddings for uncached texts
                if uncached_texts:
                    logger.info(f"Generating embeddings for {len(uncached_texts)} uncached texts")
                    response = self.client.embed(
                        texts=uncached_texts,
                        model=model,
                        input_type=input_type,
                    )
                    new_embeddings = [embedding for embedding in response.embeddings]

                    # Validate that all new embeddings have the correct dimension (1024 for embed-multilingual-v3.0)
                    for j, embedding in enumerate(new_embeddings):
                        if len(embedding) != 1024:
                            raise EmbeddingGenerationError(
                                f"Generated embedding {j} in batch has dimension {len(embedding)}, expected 1024 for model {model}"
                            )

                        # Cache the new embedding
                        embedding_cache.set(uncached_texts[j], embedding, model)

                    # Place the new embeddings in the right positions
                    for idx, new_embedding in zip(uncached_indices, new_embeddings):
                        embeddings[idx] = new_embedding

                logger.info(f"Successfully generated {len(embeddings)} batch embeddings with dimension 1024 using model {model}")
                return embeddings
            except Exception as e:
                error_id = self.handle_external_service_error(
                    e,
                    "generate_embeddings_batch",
                    "cohere-api",
                    metadata={
                        "batch_size": len(texts),
                        "model": model,
                        "input_type": input_type
                    }
                )
                logger.error(f"Failed to generate embeddings batch with Cohere (Error ID: {error_id}): {e}")
                raise EmbeddingGenerationError(
                    f"Failed to generate embeddings batch: {str(e)}"
                )

        def _generate_embeddings_batch_fallback(
            texts: List[str],
            model_name: str = "embed-multilingual-v3.0",
            input_type: str = "search_document",
        ) -> List[List[float]]:
            """Fallback method that returns zero vectors when Cohere fails."""
            logger.warning(f"Using fallback embeddings for {len(texts)} texts in batch")
            # Return zero vectors as fallback (this will result in poor similarity matches)
            # but allows the system to continue operating
            model = model_name or self.model
            fallback_embeddings = []
            for i, text in enumerate(texts):
                # Create a zero vector of 1024 dimensions
                zero_embedding = [0.0] * 1024
                fallback_embeddings.append(zero_embedding)
                # Still cache the fallback embedding to avoid repeated fallback calls
                embedding_cache.set(text, zero_embedding, model)
            return fallback_embeddings

        # Use external service handler with fallback
        return external_service_handler.call_with_fallback(
            "cohere-batch-embeddings",
            _generate_embeddings_batch_primary,
            _generate_embeddings_batch_fallback,
            texts, model_name, input_type
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


cohere_service = _CohereServiceProvider()
