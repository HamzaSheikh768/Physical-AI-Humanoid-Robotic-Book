#!/usr/bin/env python3
"""Cohere API Integration Snippet for RAG Embedding Pipeline

This file demonstrates the proper integration of Cohere API with the RAG system,
specifically using the embed-multilingual-v3.0 model with 1024-dimensional vectors
for Qdrant Cloud storage.
"""

import asyncio
import logging
from typing import List, Dict, Any
from uuid import uuid4

import cohere

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class CohereRAGIntegration:
    """Class demonstrating proper Cohere API integration for RAG pipeline."""

    def __init__(self, api_key: str):
        """Initialize Cohere client with proper configuration."""
        self.client = cohere.Client(api_key)
        self.model = "embed-multilingual-v3.0"  # 1024-dimensional vectors
        logger.info(f"Initialized Cohere client with model: {self.model}")

    def generate_document_embeddings(self, documents: List[str]) -> List[List[float]]:
        """
        Generate embeddings for a list of documents using Cohere API.

        Args:
            documents: List of text documents to embed

        Returns:
            List of 1024-dimensional embedding vectors
        """
        try:
            # Generate embeddings using the multilingual-v3.0 model
            response = self.client.embed(
                texts=documents,
                model=self.model,
                input_type="search_document",  # Optimize for document search
            )

            # Validate dimensions (should be 1024 for embed-multilingual-v3.0)
            embeddings = [embedding for embedding in response.embeddings]
            for i, embedding in enumerate(embeddings):
                if len(embedding) != 1024:
                    raise ValueError(
                        f"Embedding {i} has dimension {len(embedding)}, expected 1024"
                    )

            logger.info(f"Successfully generated {len(embeddings)} embeddings with dimension 1024")
            return embeddings

        except Exception as e:
            logger.error(f"Failed to generate document embeddings: {e}")
            raise

    def generate_query_embedding(self, query: str) -> List[float]:
        """
        Generate embedding for a search query using Cohere API.

        Args:
            query: Search query text

        Returns:
            1024-dimensional embedding vector
        """
        try:
            # Generate embedding for query using the multilingual-v3.0 model
            response = self.client.embed(
                texts=[query],
                model=self.model,
                input_type="search_query",  # Optimize for search queries
            )

            # Extract and validate the embedding
            embedding = response.embeddings[0]
            if len(embedding) != 1024:
                raise ValueError(
                    f"Query embedding has dimension {len(embedding)}, expected 1024"
                )

            logger.info("Successfully generated query embedding with dimension 1024")
            return embedding

        except Exception as e:
            logger.error(f"Failed to generate query embedding: {e}")
            raise

    def generate_embeddings_with_metadata(
        self,
        texts: List[str],
        metadata_list: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Generate embeddings with associated metadata for RAG storage.

        Args:
            texts: List of text chunks to embed
            metadata_list: List of metadata dictionaries for each text

        Returns:
            List of dictionaries containing embeddings and metadata
        """
        if len(texts) != len(metadata_list):
            raise ValueError("Texts and metadata lists must have the same length")

        try:
            # Generate embeddings for all texts
            embeddings = self.generate_document_embeddings(texts)

            # Combine embeddings with metadata
            results = []
            for i, (text, embedding, metadata) in enumerate(zip(texts, embeddings, metadata_list)):
                result = {
                    "embedding_id": str(uuid4()),
                    "text": text,
                    "embedding": embedding,
                    "metadata": metadata,
                    "model": self.model,
                    "dimension": len(embedding),  # Should be 1024
                    "created_at": "2025-12-24T00:00:00Z"
                }
                results.append(result)

            logger.info(f"Successfully processed {len(results)} text chunks with metadata")
            return results

        except Exception as e:
            logger.error(f"Failed to generate embeddings with metadata: {e}")
            raise

    async def async_generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Async wrapper for generating embeddings (for use with async frameworks).

        Args:
            texts: List of text documents to embed

        Returns:
            List of 1024-dimensional embedding vectors
        """
        import concurrent.futures
        import threading

        loop = asyncio.get_event_loop()

        def _sync_generate():
            return self.generate_document_embeddings(texts)

        with concurrent.futures.ThreadPoolExecutor() as executor:
            future = executor.submit(_sync_generate)
            embeddings = await loop.run_in_executor(None, future.result)

        return embeddings


def main():
    """Example usage of the Cohere RAG integration."""
    # Example API key - in production, use environment variables
    COHERE_API_KEY = "YOUR_COHERE_API_KEY_HERE"

    # Initialize the integration
    cohere_integration = CohereRAGIntegration(COHERE_API_KEY)

    # Example documents to embed
    documents = [
        "Physical AI and humanoid robotics represent the convergence of digital intelligence with physical form.",
        "ROS 2 provides the middleware framework for robot communication and coordination.",
        "NVIDIA Isaac Platform offers GPU-accelerated simulation and AI capabilities for robotics."
    ]

    # Generate embeddings for documents
    print("1. Generating document embeddings...")
    doc_embeddings = cohere_integration.generate_document_embeddings(documents)
    print(f"   Generated {len(doc_embeddings)} embeddings, each with dimension {len(doc_embeddings[0])}")

    # Generate embedding for a search query
    print("\n2. Generating query embedding...")
    query = "How does ROS 2 enable robot communication?"
    query_embedding = cohere_integration.generate_query_embedding(query)
    print(f"   Generated query embedding with dimension {len(query_embedding)}")

    # Generate embeddings with metadata (for RAG storage)
    print("\n3. Generating embeddings with metadata...")
    metadata_list = [
        {"module": "Introduction", "chapter": "1", "section": "1.1"},
        {"module": "ROS 2", "chapter": "2", "section": "2.1"},
        {"module": "NVIDIA Isaac", "chapter": "3", "section": "3.1"}
    ]

    embedded_with_metadata = cohere_integration.generate_embeddings_with_metadata(
        documents,
        metadata_list
    )
    print(f"   Processed {len(embedded_with_metadata)} items with metadata")

    # Show example of one embedded item
    example_item = embedded_with_metadata[0]
    print(f"\n   Example embedded item:")
    print(f"   - ID: {example_item['embedding_id'][:8]}...")
    print(f"   - Text preview: {example_item['text'][:50]}...")
    print(f"   - Model: {example_item['model']}")
    print(f"   - Dimension: {example_item['dimension']}")
    print(f"   - Metadata: {example_item['metadata']}")


if __name__ == "__main__":
    # Run the example
    main()

    # Example async usage
    print("\n4. Async usage example...")

    async def async_example():
        COHERE_API_KEY = "YOUR_COHERE_API_KEY_HERE"
        cohere_integration = CohereRAGIntegration(COHERE_API_KEY)

        texts = [
            "Example text for async embedding generation",
            "Another example text for testing"
        ]

        embeddings = await cohere_integration.async_generate_embeddings(texts)
        print(f"   Async generated {len(embeddings)} embeddings")
        return embeddings

    # Uncomment to run async example
    # asyncio.run(async_example())