"""
Test script to verify embedding storage functionality to Qdrant collection.
"""
import asyncio
import logging
import sys
import os
from typing import List

# Add the project root to Python path to allow imports
project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, project_root)

from backend.services.embedding_service import embedding_service
from backend.models.content import TextbookContent
from backend.embeddings.cohere_embed import CohereEmbeddingService
from backend.vectorstore.qdrant_client import qdrant_client
from backend.utils.chunking import TextChunker


# Configure logging for testing
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_single_embedding_storage():
    """Test storing a single embedding to Qdrant."""
    print("Testing single embedding storage...")

    # Initialize services
    await qdrant_client.initialize()

    # Test embedding generation and storage
    test_text = "This is a test sentence for embedding storage to Qdrant."

    try:
        # Generate embedding using Cohere service
        cohere_service = CohereEmbeddingService()
        embedding = cohere_service.generate_query_embedding(test_text)

        print(f"Generated embedding with {len(embedding)} dimensions")
        assert len(embedding) == 1024, f"Expected 1024 dimensions, got {len(embedding)}"

        # Store embedding using the embedding service
        embedding_record = await embedding_service.create_embedding_record(
            content_id="test-content-1",
            embedding=embedding,
            model_name="embed-multilingual-v3.0",
            module="test-module",
            chapter="test-chapter",
            section="test-section",
            text_chunk=test_text,
            metadata={"test": True, "source": "test"}
        )

        print(f"Successfully stored embedding with ID: {embedding_record.embedding_id}")

        # Verify the embedding was stored in Qdrant
        verification_result = await qdrant_client.verify_embedding_insertion(embedding_record.embedding_id)
        print(f"Verification result: {verification_result}")

        # Get collection statistics
        stats = await qdrant_client.get_collection_statistics()
        print(f"Collection statistics: {stats}")

        return True

    except Exception as e:
        logger.error(f"Error in single embedding storage test: {e}")
        return False


async def test_batch_embedding_storage():
    """Test storing batch embeddings to Qdrant."""
    print("\nTesting batch embedding storage...")

    try:
        # Test texts for batch processing
        test_texts = [
            "This is the first test sentence for batch embedding.",
            "This is the second test sentence for batch embedding.",
            "This is the third test sentence for batch embedding."
        ]

        # Generate embeddings using Cohere service
        cohere_service = CohereEmbeddingService()
        embeddings = cohere_service.generate_embeddings(test_texts)

        print(f"Generated {len(embeddings)} embeddings, each with {len(embeddings[0])} dimensions")
        assert len(embeddings) == len(test_texts), f"Expected {len(test_texts)} embeddings, got {len(embeddings)}"
        assert all(len(embedding) == 1024 for embedding in embeddings), "All embeddings should have 1024 dimensions"

        # Store each embedding
        embedding_ids = []
        for i, (text, embedding) in enumerate(zip(test_texts, embeddings)):
            embedding_record = await embedding_service.create_embedding_record(
                content_id=f"test-content-batch-{i}",
                embedding=embedding,
                model_name="embed-multilingual-v3.0",
                module="test-module",
                chapter="test-chapter",
                section="test-section",
                text_chunk=text,
                metadata={"test": True, "batch": i}
            )
            embedding_ids.append(embedding_record.embedding_id)
            print(f"Stored batch embedding {i+1} with ID: {embedding_record.embedding_id}")

        print(f"Successfully stored {len(embedding_ids)} batch embeddings")

        # Verify a few embeddings were stored
        for embedding_id in embedding_ids[:2]:  # Check first 2
            verification_result = await qdrant_client.verify_embedding_insertion(embedding_id)
            print(f"Verification for {embedding_id}: {verification_result}")

        return True

    except Exception as e:
        logger.error(f"Error in batch embedding storage test: {e}")
        return False


async def test_content_chunking_and_storage():
    """Test the complete process of chunking content and storing embeddings."""
    print("\nTesting content chunking and storage...")

    try:
        # Create test content
        test_content = TextbookContent(
            content_id="test-content-full",
            title="Test Content for Embedding Storage",
            text="""
This is a longer piece of content that will be chunked into smaller pieces.
The embedding service should chunk this content appropriately and generate
embeddings for each chunk. Each chunk will then be stored in the Qdrant collection
with proper metadata and references to the original content.

Here is another paragraph with different content to ensure we have multiple
chunks. The chunking algorithm should identify appropriate boundaries for
splitting the content while maintaining context.

And here's a third paragraph to make sure we have sufficient content for
testing the chunking and embedding storage functionality. This should
result in multiple chunks being created and stored.
            """,
            module="Test Module",
            chapter="Test Chapter",
            section="Test Section",
            page_numbers="1-10",
            metadata={"source": "test", "type": "content"},
        )

        # Process and store the content (this will chunk, embed, and store)
        embedding_ids = await embedding_service.process_and_store_content(test_content)

        print(f"Successfully processed and stored content with {len(embedding_ids)} embeddings")
        print(f"Embedding IDs: {embedding_ids}")

        # Verify a few embeddings were stored
        for embedding_id in embedding_ids[:3]:  # Check first 3
            verification_result = await qdrant_client.verify_embedding_insertion(embedding_id)
            print(f"Verification for {embedding_id}: {verification_result}")

        # Get updated collection statistics
        stats = await qdrant_client.get_collection_statistics()
        print(f"Updated collection statistics: {stats}")

        return True

    except Exception as e:
        logger.error(f"Error in content chunking and storage test: {e}")
        return False


async def test_embedding_retrieval():
    """Test retrieving embeddings from Qdrant."""
    print("\nTesting embedding retrieval...")

    try:
        # Generate a test query embedding
        cohere_service = CohereEmbeddingService()
        query_text = "Test query for retrieving similar embeddings"
        query_embedding = cohere_service.generate_query_embedding(query_text)

        print(f"Generated query embedding with {len(query_embedding)} dimensions")

        # Retrieve similar embeddings
        similar_embeddings = await embedding_service.retrieve_similar_embeddings(
            query_embedding=query_embedding,
            top_k=3,
            module="test-module"  # Filter by test module if any exist
        )

        print(f"Retrieved {len(similar_embeddings)} similar embeddings")

        for i, embedding in enumerate(similar_embeddings):
            print(f"Similar embedding {i+1}: ID={embedding.embedding_id}, Content ID={embedding.content_id}")

        return True

    except Exception as e:
        logger.error(f"Error in embedding retrieval test: {e}")
        return False


async def run_all_tests():
    """Run all embedding storage tests."""
    print("Starting embedding storage tests...\n")

    results = []

    # Test single embedding storage
    results.append(("Single Embedding Storage", await test_single_embedding_storage()))

    # Test batch embedding storage
    results.append(("Batch Embedding Storage", await test_batch_embedding_storage()))

    # Test content chunking and storage
    results.append(("Content Chunking and Storage", await test_content_chunking_and_storage()))

    # Test embedding retrieval
    results.append(("Embedding Retrieval", await test_embedding_retrieval()))

    print("\n" + "="*50)
    print("TEST RESULTS SUMMARY:")
    print("="*50)

    all_passed = True
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
        if not result:
            all_passed = False

    print("="*50)
    if all_passed:
        print("🎉 ALL TESTS PASSED! Embedding storage functionality is working correctly.")
    else:
        print("⚠️  SOME TESTS FAILED! Please check the implementation.")

    return all_passed


if __name__ == "__main__":
    asyncio.run(run_all_tests())