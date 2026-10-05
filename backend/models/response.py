"""Response model for the RAG Chatbot API."""

from datetime import datetime
from typing import List, Optional
from uuid import uuid4

from pydantic import BaseModel, Field, model_validator


class SourceCitation(BaseModel):
    """Model representing a citation to specific textbook content used in the response."""

    citation_id: str = Field(
        default_factory=lambda: str(uuid4()),
        description="Unique identifier for the citation",
    )
    content_id: str = Field(..., description="Reference to the textbook content")
    title: str = Field(..., description="Title of the cited content")
    text_excerpt: str = Field(..., description="Excerpt from the cited text")
    module: str = Field(..., description="Module identifier")
    chapter: str = Field(..., description="Chapter identifier")
    section: str = Field(..., description="Section identifier")
    relevance_score: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="How relevant this source was to the query (0-1)",
    )


class ResponseModel(BaseModel):
    """Model representing a generated answer to user queries."""

    response_id: str = Field(..., description="Unique identifier for the response")
    query_id: str = Field(..., description="Reference to the original query")
    answer_text: str = Field(..., description="The generated answer text")
    source_citations: List[SourceCitation] = Field(
        default=[], max_items=5, description="List of source citations used"
    )
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence level of the response (0-1)"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="When the response was generated"
    )
    query_text: str = Field(..., description="The original query text")


class QueryResponse(BaseModel):
    """Response model for query endpoint."""

    response_id: str = Field(..., description="Unique identifier for the response")
    query_id: str = Field(
        default_factory=lambda: str(uuid4()),
        description="Reference to the original query",
    )
    # ``answer_text`` is the public API contract used by the backend tests and
    # clients. ``answer`` remains available for the existing frontend client.
    answer: str = Field(default="", description="The generated answer text")
    answer_text: str = Field(default="", description="The generated answer text")
    source_citations: List[SourceCitation] = Field(
        default=[], max_items=5, description="List of source citations used"
    )
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="Confidence level of the response (0-1)"
    )
    query_text: str = Field(..., description="The original query text")
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="When the response was generated"
    )
    conversation_id: Optional[str] = Field(
        None, description="ID of the conversation thread if applicable"
    )

    @model_validator(mode="after")
    def synchronize_answer_fields(self) -> "QueryResponse":
        """Keep the legacy ``answer`` and canonical ``answer_text`` fields aligned."""
        if not self.answer_text and self.answer:
            self.answer_text = self.answer
        elif not self.answer and self.answer_text:
            self.answer = self.answer_text
        return self
