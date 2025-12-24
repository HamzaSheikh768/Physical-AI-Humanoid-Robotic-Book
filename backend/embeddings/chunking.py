"""Text chunking utilities for the RAG Chatbot API."""

import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class TextChunk:
    """Represents a chunk of text with metadata."""
    text: str
    module: str = ""
    chapter: str = ""
    section: str = ""
    page: Optional[int] = None
    chunk_index: int = 0
    source_file: str = ""


class TextChunker:
    """Utility class for chunking text into smaller pieces for embedding."""

    def __init__(self, max_chunk_size: int = 512, overlap: int = 50):
        """
        Initialize the text chunker.

        Args:
            max_chunk_size: Maximum number of tokens/characters per chunk
            overlap: Number of tokens/characters to overlap between chunks
        """
        self.max_chunk_size = max_chunk_size
        self.overlap = overlap

    def chunk_text(
        self,
        text: str,
        module: str = "",
        chapter: str = "",
        section: str = "",
        source_file: str = ""
    ) -> List[TextChunk]:
        """
        Chunk a large text into smaller pieces.

        Args:
            text: The text to chunk
            module: Module name for metadata
            chapter: Chapter name for metadata
            section: Section name for metadata
            source_file: Source file name for metadata

        Returns:
            List of TextChunk objects
        """
        if not text:
            return []

        # Split text into sentences to avoid cutting in the middle of sentences
        sentences = self._split_into_sentences(text)

        chunks = []
        current_chunk = ""
        chunk_index = 0

        for sentence in sentences:
            # Check if adding this sentence would exceed the chunk size
            if len(current_chunk + sentence) <= self.max_chunk_size:
                current_chunk += sentence
            else:
                # If the current chunk is not empty, save it
                if current_chunk.strip():
                    chunks.append(
                        TextChunk(
                            text=current_chunk.strip(),
                            module=module,
                            chapter=chapter,
                            section=section,
                            chunk_index=chunk_index,
                            source_file=source_file
                        )
                    )
                    chunk_index += 1

                # If the sentence itself is longer than max_chunk_size, split it
                if len(sentence) > self.max_chunk_size:
                    sub_chunks = self._split_long_sentence(sentence)
                    for sub_chunk in sub_chunks[:-1]:  # Add all but the last one
                        chunks.append(
                            TextChunk(
                                text=sub_chunk,
                                module=module,
                                chapter=chapter,
                                section=section,
                                chunk_index=chunk_index,
                                source_file=source_file
                            )
                        )
                        chunk_index += 1
                    # The last part becomes the current chunk
                    current_chunk = sub_chunks[-1]
                else:
                    current_chunk = sentence

        # Add the last chunk if it exists
        if current_chunk.strip():
            chunks.append(
                TextChunk(
                    text=current_chunk.strip(),
                    module=module,
                    chapter=chapter,
                    section=section,
                    chunk_index=chunk_index,
                    source_file=source_file
                )
            )

        logger.info(f"Chunked text into {len(chunks)} chunks from source: {source_file}")
        return chunks

    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences using common sentence delimiters.

        Args:
            text: Text to split

        Returns:
            List of sentences
        """
        import re

        # Split on sentence endings followed by whitespace and capital letter
        # This handles common sentence boundaries: . ! ? followed by space and capital
        sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)

        # Clean up the sentences
        cleaned_sentences = []
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence:
                # Ensure sentence ends with proper punctuation
                if not sentence.endswith(('.', '!', '?')):
                    sentence += '.'
                cleaned_sentences.append(sentence + ' ')

        return cleaned_sentences

    def _split_long_sentence(self, sentence: str) -> List[str]:
        """
        Split a sentence that is longer than max_chunk_size into smaller pieces.

        Args:
            sentence: Long sentence to split

        Returns:
            List of text chunks
        """
        if len(sentence) <= self.max_chunk_size:
            return [sentence]

        chunks = []
        start = 0

        while start < len(sentence):
            end = start + self.max_chunk_size

            # If we're not at the end and we're in the middle of a word,
            # try to find a word boundary
            if end < len(sentence) and sentence[end] != ' ':
                # Look for the last space before the limit
                while end > start and sentence[end] != ' ':
                    end -= 1

                # If we couldn't find a space, just cut at the limit
                if end == start:
                    end = start + self.max_chunk_size

            chunk = sentence[start:end].strip()
            if chunk:
                chunks.append(chunk)

            # Move start forward, considering overlap
            start = end
            if start < len(sentence) and self.overlap > 0:
                # Include overlap by moving back a bit
                start = max(start - self.overlap, 0)
                # But make sure we don't go back to a chunk we already processed
                if start <= end - self.max_chunk_size:
                    start = end

        return chunks

    def chunk_markdown(
        self,
        markdown_text: str,
        module: str = "",
        chapter: str = "",
        section: str = "",
        source_file: str = ""
    ) -> List[TextChunk]:
        """
        Chunk markdown text, preserving structural information.

        Args:
            markdown_text: Markdown text to chunk
            module: Module name for metadata
            chapter: Chapter name for metadata
            section: Section name for metadata
            source_file: Source file name for metadata

        Returns:
            List of TextChunk objects
        """
        # For now, treat markdown as regular text
        # In the future, we could parse markdown structure to preserve headings
        return self.chunk_text(
            markdown_text,
            module=module,
            chapter=chapter,
            section=section,
            source_file=source_file
        )


# Global instance
text_chunker = TextChunker(max_chunk_size=512, overlap=50)


def chunk_text(
    text: str,
    module: str = "",
    chapter: str = "",
    section: str = "",
    source_file: str = ""
) -> List[TextChunk]:
    """
    Convenience function to chunk text using the global chunker instance.

    Args:
        text: The text to chunk
        module: Module name for metadata
        chapter: Chapter name for metadata
        section: Section name for metadata
        source_file: Source file name for metadata

    Returns:
        List of TextChunk objects
    """
    return text_chunker.chunk_text(text, module, chapter, section, source_file)


if __name__ == "__main__":
    # Test the chunker
    sample_text = """
    Artificial Intelligence is a wonderful field. It encompasses many subfields like machine learning, deep learning, and natural language processing.
    Machine learning algorithms can learn from data without being explicitly programmed. This is particularly useful for pattern recognition tasks.
    Deep learning uses neural networks with multiple layers to learn complex patterns. These networks can process images, text, and other data types.
    Natural language processing enables computers to understand and generate human language. Applications include chatbots, translation, and text summarization.
    """

    chunks = chunk_text(sample_text, module="AI", chapter="Introduction", source_file="test.md")

    print(f"Generated {len(chunks)} chunks:")
    for i, chunk in enumerate(chunks):
        print(f"Chunk {i}: {len(chunk.text)} chars - {chunk.text[:50]}...")