"""RAG (Retrieval-Augmented Generation) service for the chatbot."""

import logging
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

import openai

from backend.config import settings
from backend.db.neon_postgres import db
from backend.embeddings.cohere_embed import cohere_service
from backend.models.query import Query, QueryRequest
from backend.models.response import QueryResponse, ResponseModel, SourceCitation
from backend.services.conversation_service import ConversationService
from backend.utils.exceptions import ExternalServiceError, RAGException
from backend.utils.logging import rag_logger
from backend.vectorstore.qdrant_client import qdrant_client

logger = logging.getLogger(__name__)


class _OpenAIResponseService:
    """Small adapter that gives the RAG service a patchable response boundary."""

    def __init__(self, rag_service: "RAGService"):
        self._rag_service = rag_service

    async def generate_response(self, query: str, context: str) -> str:
        """Generate a response using the RAG service's configured OpenAI client."""
        return await self._rag_service._generate_response_with_context(query, context)


class RAGService:
    """Service class to handle RAG operations."""

    def __init__(self):
        # Set OpenAI API key
        openai.api_key = settings.openai_api_key
        self.max_retries = 3
        # Keep dependencies on the instance so callers and tests can replace
        # integrations without patching module-level globals.
        self.cohere_service = cohere_service
        self.openai_service = _OpenAIResponseService(self)
        self.db = db
        self.qdrant = qdrant_client

    def _database_is_ready(self) -> bool:
        """Return whether persistence is initialized for conversation tracking."""
        return self.db.pool is not None and not self.db.pool.is_closed()

    async def initialize(self):
        """Initialize the RAG service by connecting to databases."""
        try:
            await self.db.connect()
            await self.qdrant.initialize()
            logger.info("RAG service initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize RAG service: {e}")
            raise

    async def process_query(self, query_request: QueryRequest) -> QueryResponse:
        """Process a user query and return a response with citations."""
        start_time = datetime.utcnow()
        query_id = str(uuid.uuid4())
        rag_logger.log_query(query_id, query_request.query, query_request.user_id)

        try:
            # Conversation persistence is available after application startup.
            # Unit callers can still exercise retrieval and generation without a
            # live database connection.
            conversation_service = None
            conversation_thread = None
            if self._database_is_ready():
                conversation_service = ConversationService()
                if query_request.conversation_id:
                    conversation_thread = (
                        await conversation_service.get_conversation_thread(
                            query_request.conversation_id
                        )
                    )
                    if not conversation_thread:
                        conversation_thread = await conversation_service.create_or_update_conversation_thread(
                            user_id=query_request.user_id,
                            title=f"Query: {query_request.query[:50]}{'...' if len(query_request.query) > 50 else ''}",
                            metadata={"created_from_query": True},
                        )
                else:
                    conversation_thread = await conversation_service.create_or_update_conversation_thread(
                        user_id=query_request.user_id,
                        title=f"Query: {query_request.query[:50]}{'...' if len(query_request.query) > 50 else ''}",
                        metadata={"created_from_query": True},
                    )

                await conversation_service.create_or_update_conversation_message(
                    conversation_id=conversation_thread.id,
                    role="user",
                    content=query_request.query,
                    context_used=None,
                    citations=None,
                )

            # Generate embedding for the query
            query_embedding = await self.cohere_service.generate_embedding(
                query_request.query,
                model_name="embed-english-v3.0",
                input_type="search_query",
            )

            # Search for similar content in the vector store
            search_results = await self.qdrant.search_similar(query_embedding, top_k=5)

            # Prepare context from search results
            context_texts = [result["text_chunk"] for result in search_results]
            context = " ".join(context_texts)

            # Generate response using OpenAI
            response_text = await self.openai_service.generate_response(
                query_request.query, context
            )

            # Create source citations
            source_citations = []
            for result in search_results:
                citation = SourceCitation(
                    citation_id=str(uuid.uuid4()),
                    content_id=result["content_id"],
                    title=f"Content {result['content_id'][:20]}...",  # Placeholder title
                    text_excerpt=(
                        result["text_chunk"][:200] + "..."
                        if len(result["text_chunk"]) > 200
                        else result["text_chunk"]
                    ),
                    module=result.get("module", "unknown"),
                    chapter=result.get("chapter", "unknown"),
                    section=result.get("section", "unknown"),
                    relevance_score=result["relevance_score"],
                )
                source_citations.append(citation)

            # Create response model
            response_id = str(uuid.uuid4())
            response_model = ResponseModel(
                response_id=response_id,
                query_id=query_id,
                answer_text=response_text,
                source_citations=source_citations,
                confidence_score=self._calculate_confidence_score(source_citations),
                timestamp=datetime.utcnow(),
                query_text=query_request.query,
            )

            if conversation_service and conversation_thread:
                await conversation_service.create_or_update_conversation_message(
                    conversation_id=conversation_thread.id,
                    role="assistant",
                    content=response_text,
                    context_used={"context_chunks": len(context_texts)},
                    citations={"citation_count": len(source_citations)},
                )

                response_time = (datetime.utcnow() - start_time).total_seconds()
                await conversation_service.create_or_update_user_analytics(
                    user_id=query_request.user_id,
                    session_id=query_request.conversation_id or conversation_thread.id,
                    query=query_request.query,
                    response_time=response_time,
                    was_answered=True,
                    used_selected_snippet=bool(query_request.context),
                    satisfaction_score=None,
                    was_accurate=None,
                )

            # Save to database
            await self.db.save_query(
                Query(
                    query_text=query_request.query,
                    context=query_request.context,
                    user_id=query_request.user_id,
                    timestamp=datetime.utcnow(),
                )
            )
            await self.db.save_response(response_model)

            rag_logger.log_response(
                response_id, query_id, response_model.confidence_score
            )

            return self._format_response(
                query_text=query_request.query,
                answer_text=response_text,
                citations=source_citations,
                query_id=query_id,
                response_id=response_id,
                timestamp=response_model.timestamp,
                conversation_id=conversation_thread.id if conversation_thread else None,
            )

        except Exception as e:
            rag_logger.log_error(type(e).__name__, str(e), query_id)
            if isinstance(e, RAGException):
                raise
            else:
                raise RAGException(f"Error processing query: {str(e)}")

    async def process_text_selection_query(
        self,
        selected_text: str,
        context: Optional[str] = None,
        user_id: Optional[str] = None,
        conversation_id: Optional[str] = None,
    ) -> QueryResponse:
        """Process a text selection query and return contextual information."""
        start_time = datetime.utcnow()
        query_id = str(uuid.uuid4())
        query_text = f"Explain more about: {selected_text[:100]}{'...' if len(selected_text) > 100 else ''}"

        rag_logger.log_query(query_id, query_text, user_id or "text_selection_user")

        try:
            conversation_service = None
            conversation_thread = None
            if self._database_is_ready():
                conversation_service = ConversationService()
                if conversation_id:
                    conversation_thread = await conversation_service.get_conversation_thread(
                        conversation_id
                    )
                    if not conversation_thread:
                        conversation_thread = await conversation_service.create_or_update_conversation_thread(
                            user_id=user_id,
                            title=f"Text Selection: {selected_text[:50]}{'...' if len(selected_text) > 50 else ''}",
                            metadata={"created_from_text_selection": True},
                        )
                else:
                    conversation_thread = await conversation_service.create_or_update_conversation_thread(
                        user_id=user_id,
                        title=f"Text Selection: {selected_text[:50]}{'...' if len(selected_text) > 50 else ''}",
                        metadata={"created_from_text_selection": True},
                    )

                await conversation_service.create_or_update_conversation_message(
                    conversation_id=conversation_thread.id,
                    role="user",
                    content=selected_text,
                    context_used={"selected_text": True},
                    citations=None,
                )

            # Generate embedding for the selected text
            query_embedding = await self.cohere_service.generate_embedding(
                selected_text,
                model_name="embed-english-v3.0",
                input_type="search_query",
            )

            # Search for similar content in the vector store
            search_results = await self.qdrant.search_similar(query_embedding, top_k=5)

            # Prepare context from search results
            context_texts = [result["text_chunk"] for result in search_results]
            # Generate response using OpenAI
            response_text = await self.openai_service.generate_response(
                f"Provide more information about: {selected_text}",
                " ".join(context_texts),
            )

            # Create source citations
            source_citations = []
            for result in search_results:
                citation = SourceCitation(
                    citation_id=str(uuid.uuid4()),
                    content_id=result["content_id"],
                    title=f"Content {result['content_id'][:20]}...",  # Placeholder title
                    text_excerpt=(
                        result["text_chunk"][:200] + "..."
                        if len(result["text_chunk"]) > 200
                        else result["text_chunk"]
                    ),
                    module=result.get("module", "unknown"),
                    chapter=result.get("chapter", "unknown"),
                    section=result.get("section", "unknown"),
                    relevance_score=result["relevance_score"],
                )
                source_citations.append(citation)

            # Create response model
            response_id = str(uuid.uuid4())
            response_model = ResponseModel(
                response_id=response_id,
                query_id=query_id,
                answer_text=response_text,
                source_citations=source_citations,
                confidence_score=self._calculate_confidence_score(source_citations),
                timestamp=datetime.utcnow(),
                query_text=selected_text,
            )

            if conversation_service and conversation_thread:
                await conversation_service.create_or_update_conversation_message(
                    conversation_id=conversation_thread.id,
                    role="assistant",
                    content=response_text,
                    context_used={"context_chunks": len(context_texts)},
                    citations={"citation_count": len(source_citations)},
                )

                response_time = (datetime.utcnow() - start_time).total_seconds()
                await conversation_service.create_or_update_user_analytics(
                    user_id=user_id,
                    session_id=conversation_id or conversation_thread.id,
                    query=selected_text,
                    response_time=response_time,
                    was_answered=True,
                    used_selected_snippet=True,
                    satisfaction_score=None,
                    was_accurate=None,
                )

            # Save to database
            await self.db.save_query(
                Query(
                    query_text=selected_text,
                    context=context,
                    user_id=user_id or "text_selection_user",
                    timestamp=datetime.utcnow(),
                )
            )
            await self.db.save_response(response_model)

            rag_logger.log_response(
                response_id, query_id, response_model.confidence_score
            )

            return self._format_response(
                query_text=selected_text,
                answer_text=response_text,
                citations=source_citations,
                query_id=query_id,
                response_id=response_id,
                timestamp=response_model.timestamp,
                conversation_id=conversation_thread.id if conversation_thread else None,
            )

        except Exception as e:
            rag_logger.log_error(type(e).__name__, str(e), query_id)
            if isinstance(e, RAGException):
                raise
            else:
                raise RAGException(f"Error processing text selection query: {str(e)}")

    def _calculate_confidence_score(self, citations: List[SourceCitation]) -> float:
        """Calculate confidence from the relevance of retrieved sources."""
        if not citations:
            return 0.0
        return round(
            min(1.0, max(0.0, sum(citation.relevance_score for citation in citations) / len(citations))),
            3,
        )

    def _format_response(
        self,
        query_text: str,
        answer_text: str,
        citations: List[SourceCitation],
        query_id: Optional[str] = None,
        response_id: Optional[str] = None,
        timestamp: Optional[datetime] = None,
        conversation_id: Optional[str] = None,
    ) -> QueryResponse:
        """Build the API response while exposing both supported answer names."""
        return QueryResponse(
            response_id=response_id or str(uuid.uuid4()),
            query_id=query_id or str(uuid.uuid4()),
            answer_text=answer_text,
            source_citations=citations,
            confidence_score=self._calculate_confidence_score(citations),
            query_text=query_text,
            timestamp=timestamp or datetime.utcnow(),
            conversation_id=conversation_id,
        )

    async def _generate_response_with_context(self, query: str, context: str) -> str:
        """Generate a response using OpenAI with the provided context."""
        try:
            if not settings.openai_api_key:
                return (
                    "The OpenAI response service is not configured. "
                    "Please configure OPENAI_API_KEY to enable generated answers."
                )

            # Prepare the prompt with context
            system_message = """You are an AI assistant for the Physical AI & Humanoid Robotics textbook.
            Use the following context to answer the user's question. If the context doesn't contain relevant information,
            acknowledge this and provide a helpful response based on general knowledge. Always maintain academic integrity."""

            user_message = f"Context: {context}\n\nQuestion: {query}"

            client = openai.AsyncOpenAI(api_key=settings.openai_api_key)
            response = await client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message},
                ],
                max_tokens=500,
                temperature=0.7,
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            logger.error(f"Error generating response with OpenAI: {e}")
            raise ExternalServiceError(f"OpenAI service error: {str(e)}")

    async def add_content_to_knowledge_base(self, content_data: Dict[str, Any]):
        """Add content to the knowledge base by generating embeddings and storing them."""
        try:
            # Save content to database
            from datetime import datetime

            from backend.models.content import TextbookContent

            # Create a TextbookContent object from the content_data
            content_obj = TextbookContent(
                content_id=content_data.get("content_id", str(uuid.uuid4())),
                title=content_data.get("title", ""),
                text=content_data.get("text", ""),
                module=content_data.get("module", ""),
                chapter=content_data.get("chapter", ""),
                section=content_data.get("section", ""),
                page_numbers=content_data.get("page_numbers", ""),
                metadata=content_data.get("metadata", {}),
                created_at=content_data.get("created_at", datetime.utcnow()),
                updated_at=content_data.get("updated_at", datetime.utcnow()),
            )

            content_id = await db.insert_content(content_obj)

            # Generate embeddings for the content
            text = content_data.get("text", "")
            title = content_data.get("title", "")

            # Simple chunking strategy - split by paragraphs
            paragraphs = text.split("\n\n")
            chunks_to_embed = []

            for i, paragraph in enumerate(paragraphs):
                if len(paragraph.strip()) > 10:  # Only process non-empty paragraphs
                    chunk_data = {
                        "text": paragraph,
                        "content_id": content_id,
                        "chunk_index": i,
                        "title": title,
                        "module": content_data.get("module", ""),
                        "chapter": content_data.get("chapter", ""),
                        "section": content_data.get("section", ""),
                    }
                    chunks_to_embed.append(chunk_data)

            # Generate embeddings for all chunks
            chunks_with_embeddings = cohere_service.embed_text_chunks(chunks_to_embed)

            # Store embeddings in Qdrant
            for chunk in chunks_with_embeddings:
                point_id = await qdrant_client.store_embedding(
                    embedding_id=f"{content_id}_chunk_{chunk['chunk_index']}",  # Use proper embedding_id
                    embedding=chunk["embedding"],
                    content_id=chunk["content_id"],
                    text_chunk=chunk["text"],  # Pass the text chunk content
                    module=chunk["module"],
                    chapter=chunk["chapter"],
                    section=chunk["section"],
                    metadata={
                        "chunk_index": chunk["chunk_index"],
                        "title": chunk["title"],
                        "module": chunk["module"],
                        "chapter": chunk["chapter"],
                        "section": chunk["section"],
                    },
                )
                rag_logger.log_embedding_process(
                    f"{content_id}:{chunk['chunk_index']}", "stored"
                )

            logger.info(
                f"Added content {content_id} with {len(chunks_to_embed)} chunks to knowledge base"
            )

        except Exception as e:
            logger.error(f"Error adding content to knowledge base: {e}")
            raise RAGException(f"Error adding content: {str(e)}")


# Global instance
rag_service = RAGService()
