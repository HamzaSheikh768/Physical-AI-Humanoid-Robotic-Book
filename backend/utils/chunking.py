"""
Text chunking utility for the RAG Chatbot API.

Implements 512-token chunks with 50-token overlap for optimal semantic search.
"""
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)


def chunk_text(text: str, chunk_size: int = 512, overlap: int = 50) -> List[Dict[str, Any]]:
    """
    Chunk text into segments with specified size and overlap.

    Args:
        text: Input text to be chunked
        chunk_size: Target size of each chunk in tokens (approximate)
        overlap: Number of tokens to overlap between chunks

    Returns:
        List of dictionaries containing chunk information
    """
    if not text:
        return []

    # For this implementation, we'll use a simple character-based approach
    # that approximates token-based chunking (1 token ~ 4 characters on average)
    # For production use, a proper tokenization library should be used
    char_chunk_size = chunk_size * 4  # Approximate character count for chunk_size tokens
    char_overlap = overlap * 4  # Approximate character count for overlap tokens

    chunks = []
    start = 0
    chunk_index = 0

    while start < len(text):
        # Determine the end position for this chunk
        end = start + char_chunk_size

        # If this is not the last chunk, try to break at a sentence or paragraph boundary
        if end < len(text):
            # Look for a sentence boundary near the end
            sentence_end = text.rfind('. ', start + char_chunk_size - 100, end)
            if sentence_end != -1 and sentence_end > start:
                end = sentence_end + 2  # Include the period and space
            else:
                # If no sentence boundary found, look for a paragraph break
                para_end = text.rfind('\n\n', start + char_chunk_size - 100, end)
                if para_end != -1 and para_end > start:
                    end = para_end
                # Otherwise, just break at the approximate token boundary
        else:
            # This is the last chunk, so use the remainder of the text
            end = len(text)

        # Extract the chunk
        chunk_text = text[start:end].strip()
        if chunk_text:  # Only add non-empty chunks
            chunk = {
                "chunk_id": f"chunk_{chunk_index}",
                "text": chunk_text,
                "chunk_index": chunk_index,
                "start_pos": start,
                "end_pos": end,
                "total_chunks": 0  # Will be updated later
            }
            chunks.append(chunk)

        # Move to the next chunk position with overlap
        start = end - char_overlap if end < len(text) else end
        chunk_index += 1

    # Update total_chunks for each chunk
    for i, chunk in enumerate(chunks):
        chunk["total_chunks"] = len(chunks)

    logger.info(f"Text chunked into {len(chunks)} chunks of approximately {chunk_size} tokens each with {overlap} tokens overlap")
    return chunks


def chunk_content_with_metadata(text: str, metadata: Dict[str, Any], chunk_size: int = 512, overlap: int = 50) -> List[Dict[str, Any]]:
    """
    Chunk text and add metadata to each chunk.

    Args:
        text: Input text to be chunked
        metadata: Metadata to include with each chunk
        chunk_size: Target size of each chunk in tokens (approximate)
        overlap: Number of tokens to overlap between chunks

    Returns:
        List of dictionaries containing chunk information with metadata
    """
    chunks = chunk_text(text, chunk_size, overlap)

    # Add metadata to each chunk
    for chunk in chunks:
        chunk.update(metadata)

    return chunks


class TextChunker:
    """
    A class to handle text chunking operations with configurable parameters.
    """

    def __init__(self, chunk_size: int = 512, overlap: int = 50):
        """
        Initialize the chunker with specific parameters.

        Args:
            chunk_size: Target size of each chunk in tokens (approximate)
            overlap: Number of tokens to overlap between chunks
        """
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk(self, text: str) -> List[Dict[str, Any]]:
        """
        Chunk text using the configured parameters.

        Args:
            text: Input text to be chunked

        Returns:
            List of dictionaries containing chunk information
        """
        return chunk_text(text, self.chunk_size, self.overlap)

    def chunk_with_metadata(self, text: str, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Chunk text and add metadata to each chunk.

        Args:
            text: Input text to be chunked
            metadata: Metadata to include with each chunk

        Returns:
            List of dictionaries containing chunk information with metadata
        """
        return chunk_content_with_metadata(text, metadata, self.chunk_size, self.overlap)