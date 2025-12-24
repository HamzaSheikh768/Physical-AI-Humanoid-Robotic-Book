"""RAG (Retrieval-Augmented Generation) service for the chatbot."""

import logging
import uuid
from datetime import datetime
from typing import Any, Dict, Optional

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


class RAGService:
    """Service class to handle RAG operations."""

    def __init__(self):
        # Don't set OpenAI API key initially to avoid the error
        self.max_retries = 3

    async def initialize(self):
        """Initialize the RAG service by connecting to databases."""
        try:
            await db.connect()
            await qdrant_client.initialize()
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
            # Get conversation service for tracking
            conversation_service = ConversationService()

            # Create or update conversation thread if provided
            conversation_thread = None
            if query_request.conversation_id:
                conversation_thread = (
                    await conversation_service.get_conversation_thread(
                        query_request.conversation_id
                    )
                )
                if not conversation_thread:
                    # Create new conversation thread if it doesn't exist
                    conversation_thread = await conversation_service.create_or_update_conversation_thread(
                        user_id=query_request.user_id,
                        title=f"Query: {query_request.query[:50]}{'...' if len(query_request.query) > 50 else ''}",
                        metadata={"created_from_query": True},
                    )
            else:
                # Create a new conversation thread if none provided
                conversation_thread = await conversation_service.create_or_update_conversation_thread(
                    user_id=query_request.user_id,
                    title=f"Query: {query_request.query[:50]}{'...' if len(query_request.query) > 50 else ''}",
                    metadata={"created_from_query": True},
                )

            # Store the user's query as a conversation message
            user_message = (
                await conversation_service.create_or_update_conversation_message(
                    conversation_id=conversation_thread.id,
                    role="user",
                    content=query_request.query,
                    context_used=None,
                    citations=None,
                )
            )

            # Generate embedding for the query
            query_embedding = cohere_service.generate_query_embedding(
                query_request.query
            )

            # Search for similar content in the vector store
            search_results = await qdrant_client.search_similar(
                query_embedding, top_k=5
            )

            # Prepare context from search results
            context_texts = [result["text_chunk"] for result in search_results]
            context = " ".join(context_texts)

            # Generate a placeholder response (without actual OpenAI call)
            # In a real implementation, you would call OpenAI here
            response_text = f"This is a placeholder response for: {query_request.query}. Retrieved context: {context[:200]}..."

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
                    module="unknown",  # Would come from content metadata
                    chapter="unknown",  # Would come from content metadata
                    section="unknown",  # Would come from content metadata
                    relevance_score=result.get("relevance_score", 0.8),
                )
                source_citations.append(citation)

            # Create response model
            response_id = str(uuid.uuid4())
            response_model = ResponseModel(
                response_id=response_id,
                query_id=query_id,
                answer_text=response_text,
                source_citations=source_citations,
                confidence_score=min(
                    1.0, len(context_texts) * 0.2
                ),  # Simple confidence calculation
                timestamp=datetime.utcnow(),
                query_text=query_request.query,
            )

            # Store the assistant's response as a conversation message
            assistant_message = (
                await conversation_service.create_or_update_conversation_message(
                    conversation_id=conversation_thread.id,
                    role="assistant",
                    content=response_text,
                    context_used={"context_chunks": len(context_texts)},
                    citations={"citation_count": len(source_citations)},
                )
            )

            # Calculate response time
            response_time = (datetime.utcnow() - start_time).total_seconds()

            # Track user analytics
            await conversation_service.create_or_update_user_analytics(
                user_id=query_request.user_id,
                session_id=query_request.conversation_id or conversation_thread.id,
                query=query_request.query,
                response_time=response_time,
                was_answered=True,
                used_selected_snippet=bool(
                    query_request.context
                ),  # If context was provided, it's from selected text
                satisfaction_score=None,  # Not provided by user
                was_accurate=None,  # Not provided by user
            )

            # Save to database
            await db.save_query(
                Query(
                    query_text=query_request.query,
                    context=query_request.context,
                    user_id=query_request.user_id,
                    timestamp=datetime.utcnow(),
                )
            )
            await db.save_response(response_model)

            rag_logger.log_response(
                response_id, query_id, response_model.confidence_score
            )

            # Return the response in the API format
            return QueryResponse(
                response_id=response_id,
                answer=response_text,
                source_citations=source_citations,
                confidence_score=response_model.confidence_score,
                query_text=query_request.query,
                timestamp=response_model.timestamp,
                conversation_id=conversation_thread.id,  # Include conversation ID in response
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
            # Get conversation service for tracking
            conversation_service = ConversationService()

            # Create or update conversation thread if provided
            conversation_thread = None
            if conversation_id:
                conversation_thread = (
                    await conversation_service.get_conversation_thread(conversation_id)
                )
                if not conversation_thread:
                    # Create new conversation thread if it doesn't exist
                    conversation_thread = await conversation_service.create_or_update_conversation_thread(
                        user_id=user_id,
                        title=f"Text Selection: {selected_text[:50]}{'...' if len(selected_text) > 50 else ''}",
                        metadata={"created_from_text_selection": True},
                    )
            else:
                # Create a new conversation thread if none provided
                conversation_thread = await conversation_service.create_or_update_conversation_thread(
                    user_id=user_id,
                    title=f"Text Selection: {selected_text[:50]}{'...' if len(selected_text) > 50 else ''}",
                    metadata={"created_from_text_selection": True},
                )

            # Store the user's selected text as a conversation message
            user_message = (
                await conversation_service.create_or_update_conversation_message(
                    conversation_id=conversation_thread.id,
                    role="user",
                    content=selected_text,
                    context_used={"selected_text": True},
                    citations=None,
                )
            )

            # Generate embedding for the selected text
            query_embedding = cohere_service.generate_query_embedding(selected_text)

            # Search for similar content in the vector store
            search_results = await qdrant_client.search_similar(
                query_embedding, top_k=5
            )

            # Prepare context from search results
            context_texts = [result["text_chunk"] for result in search_results]
            full_context = selected_text + " " + " ".join(context_texts)

            # Generate placeholder response
            response_text = f"This is a placeholder response for selected text: {selected_text[:100]}..."

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
                    module="unknown",  # Would come from content metadata
                    chapter="unknown",  # Would come from content metadata
                    section="unknown",  # Would come from content metadata
                    relevance_score=result.get("relevance_score", 0.8),
                )
                source_citations.append(citation)

            # Create response model
            response_id = str(uuid.uuid4())
            response_model = ResponseModel(
                response_id=response_id,
                query_id=query_id,
                answer_text=response_text,
                source_citations=source_citations,
                confidence_score=min(
                    1.0, len(context_texts) * 0.2
                ),  # Simple confidence calculation
                timestamp=datetime.utcnow(),
                query_text=selected_text,
            )

            # Store the assistant's response as a conversation message
            assistant_message = (
                await conversation_service.create_or_update_conversation_message(
                    conversation_id=conversation_thread.id,
                    role="assistant",
                    content=response_text,
                    context_used={"context_chunks": len(context_texts)},
                    citations={"citation_count": len(source_citations)},
                )
            )

            # Calculate response time
            response_time = (datetime.utcnow() - start_time).total_seconds()

            # Track user analytics
            await conversation_service.create_or_update_user_analytics(
                user_id=user_id,
                session_id=conversation_id or conversation_thread.id,
                query=selected_text,
                response_time=response_time,
                was_answered=True,
                used_selected_snippet=True,  # This is a text selection query
                satisfaction_score=None,  # Not provided by user
                was_accurate=None,  # Not provided by user
            )

            # Save to database
            await db.save_query(
                Query(
                    query_text=selected_text,
                    context=context,
                    user_id=user_id or "text_selection_user",
                    timestamp=datetime.utcnow(),
                )
            )
            await db.save_response(response_model)

            rag_logger.log_response(
                response_id, query_id, response_model.confidence_score
            )

            # Return the response in the API format
            return QueryResponse(
                response_id=response_id,
                answer=response_text,
                source_citations=source_citations,
                confidence_score=response_model.confidence_score,
                query_text=selected_text,
                timestamp=response_model.timestamp,
                conversation_id=conversation_thread.id,  # Include conversation ID in response
            )

        except Exception as e:
            rag_logger.log_error(type(e).__name__, str(e), query_id)
            if isinstance(e, RAGException):
                raise
            else:
                raise RAGException(f"Error processing text selection query: {str(e)}")


# Global instance
rag_service = RAGService()