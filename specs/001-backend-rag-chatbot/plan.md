# Implementation Plan: Backend RAG Chatbot API

**Branch**: `001-backend-rag-chatbot` | **Date**: 2025-12-16 | **Spec**: [specs/001-backend-rag-chatbot/spec.md](specs/001-backend-rag-chatbot/spec.md)
**Input**: Feature specification from `/specs/001-backend-rag-chatbot/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a backend RAG (Retrieval-Augmented Generation) chatbot API for the Physical AI & Humanoid Robotics textbook. The system will use FastAPI + Uvicorn to provide query endpoints, Cohere for embedding generation, Qdrant for vector storage, and Neon Postgres for metadata. The API will support both general queries and text selection queries with proper academic citations.

## Technical Context

**Language/Version**: Python 3.12
**Primary Dependencies**: FastAPI, Uvicorn, Cohere API, OpenAI ChatKit SDK, Neon Postgres, Qdrant Cloud
**Storage**: Neon Serverless Postgres for metadata, Qdrant Cloud for vector embeddings
**Testing**: pytest with unit, integration, and contract tests
**Target Platform**: Linux server (cloud deployment)
**Project Type**: Web application (backend API service)
**Performance Goals**: <2 second response time, 100 concurrent requests support
**Constraints**: <2 second response time for 95% of requests, proper academic citations, secure API key management
**Scale/Scope**: Support for textbook content, multiple concurrent users, academic integrity requirements

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the constitution file, the following gates apply:
- ✅ **Docusaurus-First Content Structure**: Content must enable semantic search capabilities by supporting Cohere embedding generation and Qdrant vector storage (compliant)
- ✅ **Tooling Mandate**: Using FastAPI + Uvicorn for backend, Cohere for embeddings, Qdrant for vector search, Neon Postgres for metadata, and OpenAI ChatKit SDK for LLM generation (compliant)
- ✅ **Quality and Verification**: All RAG responses must be traceable to specific book content with proper citations (compliant)
- ✅ **Backend Architecture Governance**: All backend endpoints must use FastAPI with Uvicorn ASGI server with proper type hints and async/await patterns (compliant)
- ✅ **Cohere Embedding Pipeline**: Book content must be processed through Cohere embedding pipeline with proper chunking strategy (compliant)
- ✅ **Data Management**: Using Neon Postgres for content metadata and Qdrant Cloud for vector storage (compliant)

*Post-design constitution check: All requirements satisfied with proper API contracts, data models, and architectural patterns implemented.*

### Post-Implementation Constitution Check

After implementing the RAG embedding ingestion pipeline:

- ✅ **Embedding Dimension Validation**: Runtime validation ensures 1024-dimensional vectors (embed-multilingual-v3.0 model) (compliant)
- ✅ **Async Lifecycle Management**: Proper initialization with await and wait=True for upsert operations (compliant)
- ✅ **Verification Methods**: Built-in methods to verify embeddings are properly inserted in Qdrant (compliant)
- ✅ **Error Handling**: Comprehensive error handling with detailed logging (compliant)
- ✅ **Text Chunking**: 512-token chunks with 50-token overlap for optimal semantic search (compliant)

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-rag-chatbot/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── main.py
├── api/
│   ├── query.py
│   └── text_selection.py
├── embeddings/
│   └── cohere_embed.py
├── db/
│   └── neon_postgres.py
├── vectorstore/
│   └── qdrant_client.py
├── models/
│   ├── query.py
│   └── response.py
├── services/
│   ├── rag_service.py
│   └── embedding_service.py
└── tests/
    ├── unit/
    ├── integration/
    └── contract/
```

**Structure Decision**: Backend-only web application structure following the directory structure specified in the feature requirements. The API will be built with FastAPI and deployed with Uvicorn, with separate modules for API endpoints, embeddings, database operations, and vector storage.

## Phase 0: Outline & Research

### Technical Context Updates

**Language/Version**: Python 3.12
**Primary Dependencies**: FastAPI, Uvicorn, Cohere API, OpenAI ChatKit SDK, Neon Postgres, Qdrant Cloud
**Storage**: Neon Serverless Postgres for metadata, Qdrant Cloud for vector embeddings
**Testing**: pytest with unit, integration, and contract tests
**Target Platform**: Linux server (cloud deployment)
**Project Type**: Web application (backend API service)
**Performance Goals**: <2 second response time, 100 concurrent requests support
**Constraints**: <2 second response time for 95% of requests, proper academic citations, secure API key management
**Scale/Scope**: Support for textbook content, multiple concurrent users, academic integrity requirements

### Resolved Unknowns

- **Cohere Model**: Using embed-multilingual-v3.0 (1024-dimensional vectors)
- **Qdrant Configuration**: 1024-dimension vectors with COSINE distance metric
- **Text Chunking**: 512-token chunks with 50-token overlap
- **Async Lifecycle**: Proper initialization with await and wait=True for upsert operations
- **Validation**: Runtime dimension validation (1024) before Qdrant upsert
- **Verification**: Built-in methods to verify embeddings are properly inserted

## Phase 1: Design & Contracts

### Data Model Updates

The following entities were identified from the feature spec:

**EmbeddingEntity**:
- embedding_id: str (primary key, UUID)
- content_id: str (foreign key to content)
- embedding: List[float] (1024-dimensional vector)
- model_name: str (e.g., "embed-multilingual-v3.0")
- module: str (textbook module identifier)
- chapter: str (textbook chapter identifier)
- section: str (textbook section identifier)
- metadata: Dict[str, Any] (additional content metadata)
- created_at: datetime (creation timestamp)
- updated_at: datetime (update timestamp)

**TextbookContent**:
- content_id: str (primary key, UUID)
- title: str (content title)
- text: str (full content text)
- module: str (module identifier)
- chapter: str (chapter identifier)
- section: str (section identifier)
- page_numbers: List[int] (associated page numbers)
- metadata: Dict[str, Any] (additional metadata)
- created_at: datetime (creation timestamp)
- updated_at: datetime (update timestamp)

### API Contracts

**Query Endpoint**:
```
POST /query
Request: {query: str, filters?: {module?: str, chapter?: str, section?: str}}
Response: {response: str, sources: List[{content_id: str, text: str, relevance_score: float}]}
```

**Text Selection Query Endpoint**:
```
POST /text-selection-query
Request: {selected_text: str, context?: str}
Response: {response: str, sources: List[{content_id: str, text: str, relevance_score: float}]}
```

## Phase 2: Implementation Plan for RAG Embedding Ingestion Pipeline

### 1. Environment Setup
- Install required Python packages: cohere, qdrant-client (async), fastapi, uvicorn
- Ensure Cohere API key is set in environment variables
- Configure Qdrant Cloud endpoint and API key
- Verify Qdrant collection exists or create if missing

### 2. Embedding Pipeline Implementation
- Implement text chunker with 512-token chunks and 50-token overlap
- Fetch website text from the Physical AI & Humanoid Robotics textbook
- Generate embeddings using Cohere API with embed-multilingual-v3.0 model
- Validate vector length = 1024 for each embedding
- Log embedding shape and ID before Qdrant upsert

### 3. QdrantVectorStore Updates
- Ensure `initialize()` is awaited before any upsert
- Implement strict runtime validation for embedding dimension (1024)
- Use `await client.upsert(..., wait=True)` to prevent silent failures
- Include payload with embedding_id, content_id, text_chunk, module, chapter, section
- Add comprehensive logging for upsert success/failure

### 4. Verification & Debug Methods
- Implement method to return collection statistics:
  - collection name
  - points_count
  - vectors_count
  - collection status
- Confirm that Points > 0 after inserting at least one embedding
- Cross-check Qdrant Cloud UI to ensure vectors appear

### 5. RAG Ingestion Flow Implementation
- Document and implement the ingestion flow:
  Website/Backend Text → Chunker → Embedding → Validate → Qdrant Upsert → Verification
- Ensure that no step can silently fail
- Include explicit logs at each checkpoint:
  - Chunk created
  - Embedding generated
  - Upsert attempt and success
  - Verification result

### 6. Testing & Validation
- Insert a small number of test embeddings
- Verify API returns correct points_count
- Confirm dimension validation triggers if a wrong-size embedding is used
- Test async lifecycle correctness
- Ensure logs accurately reflect each step

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
