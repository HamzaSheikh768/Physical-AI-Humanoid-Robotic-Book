"""
Caching utility for the RAG Chatbot API.

Implements embedding caching to reduce API calls and handle rate limits.
"""
import hashlib
import logging
import pickle
import time
from typing import Any, Dict, Optional, Union

logger = logging.getLogger(__name__)


class EmbeddingCache:
    """
    A simple in-memory cache for embeddings to reduce API calls and handle rate limits.
    """

    def __init__(self, max_size: int = 10000, ttl_seconds: int = 3600):
        """
        Initialize the cache with maximum size and TTL.

        Args:
            max_size: Maximum number of items to store in cache
            ttl_seconds: Time-to-live in seconds for cached items
        """
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds
        self.cache: Dict[str, Dict[str, Any]] = {}
        self.access_order = []  # For LRU eviction
        self.hit_count = 0
        self.miss_count = 0

    def _get_key(self, text: str, model: str = "embed-multilingual-v3.0") -> str:
        """
        Generate a cache key from text and model.

        Args:
            text: Input text to embed
            model: Embedding model name

        Returns:
            Hashed key for caching
        """
        key_string = f"{model}:{text}"
        return hashlib.sha256(key_string.encode()).hexdigest()

    def get(self, text: str, model: str = "embed-multilingual-v3.0") -> Optional[list]:
        """
        Get embedding from cache.

        Args:
            text: Input text that was embedded
            model: Embedding model name

        Returns:
            Cached embedding if found, None otherwise
        """
        key = self._get_key(text, model)

        if key in self.cache:
            entry = self.cache[key]
            # Check if entry is still valid (not expired)
            if time.time() - entry['timestamp'] < self.ttl_seconds:
                self.hit_count += 1
                logger.debug(f"Cache HIT for text: {text[:50]}... (key: {key[:8]})")
                # Move to end for LRU
                if key in self.access_order:
                    self.access_order.remove(key)
                self.access_order.append(key)
                return entry['embedding']
            else:
                # Entry expired, remove it
                del self.cache[key]
                if key in self.access_order:
                    self.access_order.remove(key)
                logger.debug(f"Cache EXPIRED for key: {key[:8]}")

        self.miss_count += 1
        logger.debug(f"Cache MISS for text: {text[:50]}... (key: {key[:8]})")
        return None

    def set(self, text: str, embedding: list, model: str = "embed-multilingual-v3.0") -> None:
        """
        Store embedding in cache.

        Args:
            text: Input text that was embedded
            embedding: The embedding vector
            model: Embedding model name
        """
        key = self._get_key(text, model)

        # Evict oldest entry if cache is full
        if len(self.cache) >= self.max_size:
            oldest_key = self.access_order.pop(0)
            del self.cache[oldest_key]
            logger.debug(f"Cache EVICTION: removed oldest entry with key {oldest_key[:8]}")

        self.cache[key] = {
            'embedding': embedding,
            'timestamp': time.time(),
            'model': model
        }
        self.access_order.append(key)
        logger.debug(f"Cache SET for text: {text[:50]}... (key: {key[:8]})")

    def clear(self) -> None:
        """Clear all cached embeddings."""
        self.cache.clear()
        self.access_order.clear()
        self.hit_count = 0
        self.miss_count = 0
        logger.info("Cache cleared")

    def get_stats(self) -> Dict[str, Union[int, float]]:
        """Get cache statistics."""
        total_requests = self.hit_count + self.miss_count
        hit_rate = self.hit_count / total_requests if total_requests > 0 else 0

        return {
            'size': len(self.cache),
            'max_size': self.max_size,
            'hit_count': self.hit_count,
            'miss_count': self.miss_count,
            'hit_rate': hit_rate,
            'ttl_seconds': self.ttl_seconds
        }

    def delete(self, text: str, model: str = "embed-multilingual-v3.0") -> bool:
        """
        Delete a specific entry from cache.

        Args:
            text: Input text that was embedded
            model: Embedding model name

        Returns:
            True if entry was found and deleted, False otherwise
        """
        key = self._get_key(text, model)
        if key in self.cache:
            del self.cache[key]
            if key in self.access_order:
                self.access_order.remove(key)
            logger.debug(f"Cache DELETE for key: {key[:8]}")
            return True
        return False


class AsyncEmbeddingCache(EmbeddingCache):
    """
    Async wrapper for the embedding cache to support async/await patterns.
    """

    async def get(self, text: str, model: str = "embed-multilingual-v3.0") -> Optional[list]:
        """Async version of get method."""
        return super().get(text, model)

    async def set(self, text: str, embedding: list, model: str = "embed-multilingual-v3.0") -> None:
        """Async version of set method."""
        super().set(text, embedding, model)

    async def delete(self, text: str, model: str = "embed-multilingual-v3.0") -> bool:
        """Async version of delete method."""
        return super().delete(text, model)


# Global instance of the cache
embedding_cache = EmbeddingCache(max_size=10000, ttl_seconds=3600)  # 10k entries, 1 hour TTL


def get_cache() -> EmbeddingCache:
    """Get the global embedding cache instance."""
    return embedding_cache


# Example usage:
if __name__ == "__main__":
    # Example usage
    cache = get_cache()

    # Test caching
    text = "This is a test sentence for embedding."
    model = "embed-multilingual-v3.0"
    embedding = [0.1] * 1024  # Example embedding

    # Store in cache
    cache.set(text, embedding, model)

    # Retrieve from cache
    cached_embedding = cache.get(text, model)
    print(f"Retrieved from cache: {cached_embedding is not None}")

    # Check stats
    stats = cache.get_stats()
    print(f"Cache stats: {stats}")