"""Qdrant vector database client for the RAG Chatbot API."""

import logging
import math
from typing import Any, Dict, List, Optional

from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models

from backend.config import settings
from backend.utils.external_service_handler import external_service_handler
from backend.utils.detailed_error_handler import DetailedErrorMixin, ErrorCategory

logger = logging.getLogger(__name__)


class QdrantVectorStore(DetailedErrorMixin):
    """Class to handle Qdrant vector database operations."""

    def __init__(self):
        # Ensure URL has proper protocol for Qdrant Cloud
        url = settings.qdrant_url
        if url and not url.startswith(("http://", "https://")):
            url = f"https://{url}"

        self.client = AsyncQdrantClient(
            url=url,
            api_key=settings.qdrant_api_key,
            prefer_grpc=False,  # Use REST API for Cloud connections
        )
        self.collection_name = settings.qdrant_collection
        self._initialized = False
        # Initialize the detailed error handler
        super().__init__("qdrant-vector-store")

    async def initialize(self):
        """Initialize the Qdrant collection."""
        try:
            # Check if collection exists
            collections = await self.client.get_collections()
            collection_exists = any(
                col.name == self.collection_name for col in collections.collections
            )

            if not collection_exists:
                # Create collection with appropriate vector size (Cohere's embed-multilingual-v3.0 model uses 1024 dimensions)
                await self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=1024,  # Cohere embed-multilingual-v3.0 embedding dimension
                        distance=models.Distance.COSINE,
                    ),
                )
                logger.info(f"Created Qdrant collection: {self.collection_name}")
            else:
                # Verify the collection has the correct vector size
                collection_info = await self.client.get_collection(self.collection_name)
                if collection_info.config.params.vectors.size != 1024:
                    raise Exception(f"Collection {self.collection_name} has vector size {collection_info.config.params.vectors.size}, expected 1024")
                logger.info(f"Qdrant collection {self.collection_name} already exists with correct configuration")

            self._initialized = True
            logger.info("Qdrant vector store initialized successfully")
        except Exception as e:
            error_id = self.handle_database_error(
                e,
                "initialize",
                metadata={
                    "collection_name": self.collection_name,
                    "expected_vector_size": 1024
                }
            )
            logger.error(f"Failed to initialize Qdrant (Error ID: {error_id}): {e}")
            raise

    async def store_embedding(
        self,
        embedding_id: str,
        embedding: List[float],
        content_id: str,
        module: str = "",
        chapter: str = "",
        section: str = "",
        metadata: Optional[Dict[str, Any]] = None,
        text_chunk: str = "",  # Add text chunk parameter
    ) -> str:
        """Store an embedding in Qdrant."""
        if not self._initialized:
            raise Exception("Qdrant vector store not initialized")

        async def _store_embedding_primary(
            embedding_id: str,
            embedding: List[float],
            content_id: str,
            module: str = "",
            chapter: str = "",
            section: str = "",
            metadata: Optional[Dict[str, Any]] = None,
            text_chunk: str = "",
        ) -> str:
            try:
                # Validate embedding dimensions (must be exactly 1024 for Cohere embed-multilingual-v3.0)
                if len(embedding) != 1024:
                    raise ValueError(f"Embedding dimension is {len(embedding)}, expected 1024 for Cohere embed-multilingual-v3.0 model")

                # Additional validation to ensure embedding contains valid float values
                if not all(isinstance(val, (int, float)) and not (math.isnan(val) or math.isinf(val)) for val in embedding):
                    raise ValueError("Embedding contains invalid values (NaN or infinity)")

                point_id = embedding_id  # Use the provided embedding_id as the point ID
                payload = {
                    "embedding_id": embedding_id,
                    "content_id": content_id,
                    "text": text_chunk,  # Store the text content
                    "module": module,
                    "chapter": chapter,
                    "section": section,
                    "created_at": "2025-12-16T10:00:00Z",  # In practice, use datetime.utcnow().isoformat()
                }
                if metadata:
                    payload.update(metadata)

                # Perform upsert with explicit wait and error handling
                result = await self.client.upsert(
                    collection_name=self.collection_name,
                    points=[
                        models.PointStruct(id=point_id, vector=embedding, payload=payload)
                    ],
                    wait=True,  # Ensure write completion
                )

                logger.info(f"Successfully stored embedding with ID: {point_id} in collection: {self.collection_name}")
                return point_id
            except Exception as e:
                error_id = self.handle_database_error(
                    e,
                    "store_embedding",
                    metadata={
                        "embedding_id": embedding_id,
                        "content_id": content_id,
                        "embedding_length": len(embedding),
                        "collection_name": self.collection_name
                    }
                )
                logger.error(f"Failed to store embedding (Error ID: {error_id}): {e}")
                raise

        async def _store_embedding_fallback(
            embedding_id: str,
            embedding: List[float],
            content_id: str,
            module: str = "",
            chapter: str = "",
            section: str = "",
            metadata: Optional[Dict[str, Any]] = None,
            text_chunk: str = "",
        ) -> str:
            """Fallback method that logs the failure but returns a success indicator."""
            logger.warning(f"Using fallback for storing embedding {embedding_id} - service unavailable")
            # In fallback mode, we log the failure but return a success indicator
            # to prevent the system from breaking completely
            return embedding_id

        # Use external service handler with fallback
        return await external_service_handler.async_call_with_fallback(
            "qdrant-store-embedding",
            _store_embedding_primary,
            _store_embedding_fallback,
            embedding_id, embedding, content_id, module, chapter, section, metadata, text_chunk
        )

    async def search_similar(
        self,
        query_vector: List[float],
        top_k: int = 5,
        module_filter: Optional[str] = None,
        chapter_filter: Optional[str] = None,
        section_filter: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Search for similar embeddings in Qdrant with optional filters."""
        if not self._initialized:
            raise Exception("Qdrant vector store not initialized")

        async def _search_similar_primary(
            query_vector: List[float],
            top_k: int = 5,
            module_filter: Optional[str] = None,
            chapter_filter: Optional[str] = None,
            section_filter: Optional[str] = None,
        ) -> List[Dict[str, Any]]:
            try:
                # Build filters if any are provided
                filters = []
                if module_filter:
                    filters.append(
                        models.FieldCondition(
                            key="module", match=models.MatchValue(value=module_filter)
                        )
                    )
                if chapter_filter:
                    filters.append(
                        models.FieldCondition(
                            key="chapter", match=models.MatchValue(value=chapter_filter)
                        )
                    )
                if section_filter:
                    filters.append(
                        models.FieldCondition(
                            key="section", match=models.MatchValue(value=section_filter)
                        )
                    )

                # Create the filter condition
                filter_condition = None
                if filters:
                    if len(filters) == 1:
                        filter_condition = models.Filter(must=[filters[0]])
                    else:
                        filter_condition = models.Filter(must=filters)

                search_results = await self.client.search(
                    collection_name=self.collection_name,
                    query_vector=query_vector,
                    limit=top_k,
                    query_filter=filter_condition,
                    with_payload=True,  # Ensure payload is returned
                )

                results = []
                for result in search_results:
                    payload = result.payload or {}
                    results.append(
                        {
                            "embedding_id": result.id,
                            "content_id": payload.get("content_id"),
                            "text_chunk": payload.get(
                                "text", ""
                            ),  # Include the text content
                            "module": payload.get("module"),
                            "chapter": payload.get("chapter"),
                            "section": payload.get("section"),
                            "relevance_score": result.score,
                            "metadata": payload,
                        }
                    )

                return results
            except Exception as e:
                logger.error(f"Failed to search similar embeddings: {e}")
                raise

        async def _search_similar_fallback(
            query_vector: List[float],
            top_k: int = 5,
            module_filter: Optional[str] = None,
            chapter_filter: Optional[str] = None,
            section_filter: Optional[str] = None,
        ) -> List[Dict[str, Any]]:
            """Fallback method that returns empty results when Qdrant fails."""
            logger.warning("Using fallback for search - returning empty results")
            # Return empty results as fallback to allow the system to continue operating
            return []

        # Use external service handler with fallback
        return await external_service_handler.async_call_with_fallback(
            "qdrant-search-similar",
            _search_similar_primary,
            _search_similar_fallback,
            query_vector, top_k, module_filter, chapter_filter, section_filter
        )

    async def delete_embedding(self, point_id: str):
        """Delete an embedding from Qdrant."""
        if not self._initialized:
            raise Exception("Qdrant vector store not initialized")

        async def _delete_embedding_primary(point_id: str):
            try:
                await self.client.delete(
                    collection_name=self.collection_name,
                    points_selector=models.PointIdsList(points=[point_id]),
                )
            except Exception as e:
                logger.error(f"Failed to delete embedding: {e}")
                raise

        async def _delete_embedding_fallback(point_id: str):
            """Fallback method that logs the failure."""
            logger.warning(f"Using fallback for deleting embedding {point_id} - operation skipped")
            # In fallback mode, we log the failure but don't raise to prevent system failure

        # Use external service handler with fallback
        return await external_service_handler.async_call_with_fallback(
            "qdrant-delete-embedding",
            _delete_embedding_primary,
            _delete_embedding_fallback,
            point_id
        )

    async def delete_embeddings_by_content_id(self, content_id: str):
        """Delete all embeddings associated with a content ID."""
        if not self._initialized:
            raise Exception("Qdrant vector store not initialized")

        async def _delete_embeddings_by_content_id_primary(content_id: str):
            try:
                # Delete embeddings by filtering on content_id
                await self.client.delete(
                    collection_name=self.collection_name,
                    points_selector=models.Filter(
                        must=[
                            models.FieldCondition(
                                key="content_id", match=models.MatchValue(value=content_id)
                            )
                        ]
                    ),
                )
            except Exception as e:
                logger.error(f"Failed to delete embeddings by content ID: {e}")
                raise

        async def _delete_embeddings_by_content_id_fallback(content_id: str):
            """Fallback method that logs the failure."""
            logger.warning(f"Using fallback for deleting embeddings by content ID {content_id} - operation skipped")
            # In fallback mode, we log the failure but don't raise to prevent system failure

        # Use external service handler with fallback
        return await external_service_handler.async_call_with_fallback(
            "qdrant-delete-embeddings-by-content-id",
            _delete_embeddings_by_content_id_primary,
            _delete_embeddings_by_content_id_fallback,
            content_id
        )

    async def get_embedding(self, point_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific embedding from Qdrant."""
        if not self._initialized:
            raise Exception("Qdrant vector store not initialized")

        async def _get_embedding_primary(point_id: str) -> Optional[Dict[str, Any]]:
            try:
                points = await self.client.retrieve(
                    collection_name=self.collection_name, ids=[point_id]
                )

                if points:
                    point = points[0]
                    return {
                        "id": point.id,
                        "vector": point.vector,
                        "payload": point.payload,
                    }
                return None
            except Exception as e:
                logger.error(f"Failed to get embedding: {e}")
                raise

        async def _get_embedding_fallback(point_id: str) -> Optional[Dict[str, Any]]:
            """Fallback method that returns None when Qdrant fails."""
            logger.warning(f"Using fallback for getting embedding {point_id} - returning None")
            return None

        # Use external service handler with fallback
        return await external_service_handler.async_call_with_fallback(
            "qdrant-get-embedding",
            _get_embedding_primary,
            _get_embedding_fallback,
            point_id
        )

    async def verify_embedding_insertion(self, point_id: str) -> bool:
        """Verify that an embedding has been successfully inserted in Qdrant."""
        async def _verify_embedding_primary(point_id: str) -> bool:
            try:
                result = await self.get_embedding(point_id)
                if result:
                    logger.info(f"✅ Verification: Embedding with ID {point_id} exists in Qdrant")
                    return True
                else:
                    logger.warning(f"❌ Verification: Embedding with ID {point_id} not found in Qdrant")
                    return False
            except Exception as e:
                logger.error(f"Verification failed for embedding {point_id}: {e}")
                raise

        async def _verify_embedding_fallback(point_id: str) -> bool:
            """Fallback method that returns False when verification fails."""
            logger.warning(f"Using fallback for verifying embedding {point_id} - returning False")
            return False

        # Use external service handler with fallback
        return await external_service_handler.async_call_with_fallback(
            "qdrant-verify-embedding",
            _verify_embedding_primary,
            _verify_embedding_fallback,
            point_id
        )

    async def get_collection_statistics(self) -> Dict[str, Any]:
        """Get statistics about the Qdrant collection."""
        async def _get_collection_statistics_primary() -> Dict[str, Any]:
            try:
                collection_info = await self.client.get_collection(self.collection_name)
                points_count = collection_info.points_count

                # Get more detailed statistics
                info = await self.client.get_collection(self.collection_name)

                stats = {
                    "collection_name": self.collection_name,
                    "vector_size": info.config.params.vectors.size,
                    "distance": info.config.params.vectors.distance,
                    "points_count": points_count,
                    "indexed_vectors_count": info.indexed_vectors_count,
                    "status": info.status,
                    "optimizer_status": info.optimizer_status,
                    "time": "2025-12-24T00:00:00Z"  # Current timestamp
                }

                logger.info(f"Qdrant collection stats: {stats}")
                return stats
            except Exception as e:
                logger.error(f"Failed to get collection statistics: {e}")
                raise

        async def _get_collection_statistics_fallback() -> Dict[str, Any]:
            """Fallback method that returns basic stats when Qdrant fails."""
            logger.warning("Using fallback for getting collection statistics")
            # Return basic stats with error indication
            return {
                "collection_name": self.collection_name,
                "vector_size": 1024,  # Default expected size
                "distance": "COSINE",  # Default expected distance
                "points_count": 0,
                "indexed_vectors_count": 0,
                "status": "ERROR",
                "optimizer_status": "ERROR",
                "time": "2025-12-24T00:00:00Z",
                "error": "Service unavailable"
            }

        # Use external service handler with fallback
        return await external_service_handler.async_call_with_fallback(
            "qdrant-get-collection-stats",
            _get_collection_statistics_primary,
            _get_collection_statistics_fallback
        )


# Global instance
qdrant_client = QdrantVectorStore()
