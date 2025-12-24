# API Contracts: Backend Audit & RAG System Completion

## Cohere Embedding API Contract

### Endpoint: `/embeddings/generate`
**Method**: POST
**Purpose**: Generate embeddings for text content using Cohere API
**Authentication**: Bearer token from COHERE_API_KEY environment variable

**Request Body**:
```json
{
  "texts": ["array", "of", "text", "chunks"],
  "model": "embed-multilingual-v3.0",
  "input_type": "search_document"
}
```

**Response**:
```json
{
  "id": "embedding-job-id",
  "embeddings": [
    [0.1, 0.2, ... , 0.9],  // 1024-dimensional vectors
    [0.3, 0.4, ... , 0.8]   // for each input text
  ],
  "meta": {
    "api_version": {"version": "1"},
    "billed_units": {"input_tokens": 10}
  }
}
```

## Qdrant Vector Store API Contract

### Endpoint: `/points/upsert`
**Method**: PUT
**Purpose**: Store embeddings in Qdrant vector database

**Request Body**:
```json
{
  "collection_name": "book_content",
  "points": [
    {
      "id": "uuid-12345",
      "vector": [0.1, 0.2, ... , 0.9],  // 1024-dim vector
      "payload": {
        "content": "text content here",
        "source_file": "Module-1-ROS2/Introduction-to-Physical-AI.md",
        "metadata": {"page": 15, "section": "1.2"}
      }
    }
  ]
}
```

## RAG Query API Contract

### Endpoint: `/query`
**Method**: POST
**Purpose**: Retrieve relevant content based on user query

**Request Body**:
```json
{
  "query": "What is Physical AI?",
  "top_k": 5
}
```

**Response**:
```json
{
  "query": "What is Physical AI?",
  "results": [
    {
      "content": "Physical AI is an approach to artificial intelligence...",
      "metadata": {
        "source_file": "Module-1-ROS2/Introduction-to-Physical-AI.md",
        "page_number": 15,
        "section": "1.2"
      },
      "similarity_score": 0.87,
      "content_id": "uuid-12345"
    }
  ],
  "timestamp": "2025-12-24T10:00:00Z"
}
```

## Environment Configuration Contract

### Required Environment Variables:
- `COHERE_API_KEY`: API key for Cohere embedding service
- `QDRANT_URL`: URL for Qdrant vector database
- `QDRANT_API_KEY`: API key for Qdrant access
- `MCP_SERVER_URL`: URL for Context7 MCP server (optional)

## Health Check Contract

### Endpoint: `/health`
**Method**: GET
**Purpose**: Check backend service health

**Response**:
```json
{
  "status": "healthy",
  "services": {
    "cohere_api": "connected",
    "qdrant_db": "connected",
    "mcp_server": "initialized"
  },
  "timestamp": "2025-12-24T10:00:00Z"
}
```