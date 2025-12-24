# Data Model: Backend Audit & RAG System Completion

## Entities

### BookContent
- **id**: string (UUID) - Unique identifier for each content chunk
- **text**: string - The actual text content of the book chunk
- **metadata**: object - Additional information about the content (source file, page number, section)
- **created_at**: datetime - Timestamp when the content was processed
- **updated_at**: datetime - Timestamp when the content was last modified

### Embedding
- **id**: string (UUID) - Unique identifier for each embedding
- **content_id**: string - Reference to the BookContent entity
- **vector**: array<float> - The embedding vector (1024 dimensions for Cohere)
- **model**: string - The embedding model used (e.g., "embed-multilingual-v3.0")
- **created_at**: datetime - Timestamp when the embedding was generated

### QdrantPoint
- **id**: string (UUID) - Qdrant point ID
- **payload**: object - Contains content text and metadata
- **vector**: array<float> - The 1024-dimensional embedding vector
- **content_id**: string - Reference to the original BookContent

### QueryRequest
- **query**: string - The user's query text
- **top_k**: integer - Number of results to return (default: 5)
- **filters**: object - Optional filters for content retrieval

### QueryResponse
- **query**: string - The original query text
- **results**: array<QueryResult> - List of relevant content chunks
- **timestamp**: datetime - When the query was processed

### QueryResult
- **content**: string - The relevant text chunk
- **metadata**: object - Metadata about the source content
- **similarity_score**: float - Similarity score from vector search
- **content_id**: string - Reference to the original content

## Relationships

- BookContent (1) -> Embedding (1) - Each content chunk has one corresponding embedding
- Embedding (1) -> QdrantPoint (1) - Each embedding is stored as one Qdrant point
- QueryRequest (1) -> QueryResponse (1) - Each query request produces one response
- QueryResponse (*) -> QueryResult (*) - Each response contains multiple results

## Validation Rules

### BookContent
- text must be between 10 and 2000 characters
- metadata must contain source file information
- created_at and updated_at must be valid ISO 8601 timestamps

### Embedding
- vector must have exactly 1024 dimensions
- model must be a valid Cohere embedding model
- content_id must reference an existing BookContent

### QueryRequest
- query must be between 1 and 500 characters
- top_k must be between 1 and 20

## State Transitions

### Content Processing Flow
1. Raw book content is ingested
2. Content is chunked according to the defined strategy
3. Each chunk is assigned a BookContent entity
4. Embeddings are generated for each BookContent
5. Embeddings are stored in Qdrant
6. Content is ready for retrieval queries