# Quickstart Guide: Backend RAG Chatbot API

## Prerequisites

- Python 3.12+
- pip package manager
- Git
- Access to Cohere API (API key)
- Access to OpenAI API (API key)
- Qdrant Cloud account (API key and URL)
- Neon Postgres database (connection URL)

## Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install fastapi uvicorn cohere openai psycopg2-binary qdrant-client python-dotenv
```

### 4. Set Up Environment Variables
Create a `.env` file in the project root:
```env
COHERE_API_KEY=your_cohere_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
QDRANT_URL=your_qdrant_cloud_url
QDRANT_API_KEY=your_qdrant_api_key
NEON_POSTGRES_URL=your_neon_postgres_connection_string
UVICORN_HOST=0.0.0.0
UVICORN_PORT=8000
```

## Running the Application

### 1. Start the Server
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Verify Installation
Open your browser or use curl to check the health endpoint:
```bash
curl http://localhost:8000/health
```

You should receive a response similar to:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-16T10:00:00Z",
  "dependencies": {
    "cohere_api": "connected",
    "qdrant": "connected",
    "postgres": "connected"
  }
}
```

## Testing the API

### Query Endpoint
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is Physical AI?",
    "context": "I want to understand the basic concept"
  }'
```

### Text Selection Query Endpoint
```bash
curl -X POST http://localhost:8000/text-selection-query \
  -H "Content-Type: application/json" \
  -d '{
    "selected_text": "Physical AI is a new approach to robotics",
    "context": "Explain this concept in more detail"
  }'
```

## Initial Content Setup

To initialize the RAG system with textbook content:

1. Prepare your textbook content in the expected format
2. Run the embedding script to generate and store embeddings:
```bash
python -m embeddings.cohere_embed --input-path /path/to/textbook/content
```

This will:
- Process the textbook content
- Generate Cohere embeddings for each content chunk
- Store embeddings in Qdrant
- Store metadata in Neon Postgres

## RAG Embedding Ingestion Pipeline

### 1. Environment Setup for Embedding Pipeline
Ensure your `.env` file includes the correct Cohere model:
```env
COHERE_MODEL=embed-multilingual-v3.0  # Uses 1024-dimensional vectors
QDRANT_COLLECTION=Book-Embedding
```

### 2. Initialize Qdrant Collection
The system will automatically create a Qdrant collection with 1024-dimensional vectors when you first run the embedding service:
```python
from vectorstore.qdrant_client import qdrant_client

# Initialize the Qdrant client (creates collection if it doesn't exist)
await qdrant_client.initialize()
```

### 3. Process and Embed Content
```python
from services.embedding_service import embedding_service

# Example: Process a textbook section
content = {
    "content_id": "module1-chapter1-section1",
    "title": "Introduction to Physical AI",
    "text": "Physical AI represents the convergence of digital intelligence with physical form...",
    "module": "Module 1",
    "chapter": "Chapter 1",
    "section": "Section 1"
}

# Process and store embeddings
embedding_ids = await embedding_service.process_and_store_content(content)
print(f"Created {len(embedding_ids)} embeddings")
```

### 4. Verify Embedding Insertion
```python
# Get collection statistics
stats = await qdrant_client.get_collection_statistics()
print(f"Collection has {stats['points_count']} points")

# Verify specific embedding was inserted
success = await qdrant_client.verify_embedding_insertion(embedding_ids[0])
print(f"Embedding verification: {'✅' if success else '❌'}")
```

### 5. Run Tests
```bash
# Test Cohere integration
python -m backend.test_embedding_integration

# Test Qdrant connection
python -m backend.test_qdrant_connection

# Test embedding storage
python -m backend.test_qdrant_embeddings
```

### 6. Verification Steps
1. Check that your Qdrant Cloud collection has Points > 0
2. Verify that embeddings have 1024 dimensions
3. Confirm that content is properly chunked and embedded
4. Test query functionality returns relevant results

### 7. Troubleshooting the Pipeline
- **Empty Points count**: Verify Cohere API key and embedding generation
- **Dimension mismatch**: Ensure using embed-multilingual-v3.0 model (1024 dimensions)
- **Connection errors**: Check Qdrant Cloud URL and API key
- **Slow responses**: Verify database and vector store connections

## Configuration

### Environment Variables
- `UVICORN_HOST`: Host for the Uvicorn server (default: 0.0.0.0)
- `UVICORN_PORT`: Port for the Uvicorn server (default: 8000)
- `COHERE_MODEL`: Cohere model to use for embeddings (default: embed-multilingual-v2.0)
- `QDRANT_COLLECTION`: Name of the Qdrant collection (default: textbook_embeddings)
- `MAX_CONCURRENT_REQUESTS`: Maximum concurrent requests (default: 100)

### Performance Tuning
- Adjust the number of Uvicorn workers based on your server capacity
- Configure connection pooling for database and vector store connections
- Set up response caching for frequently asked queries

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Verify all API keys and connection URLs are correct
2. **Rate Limiting**: Check your API usage limits with Cohere and OpenAI
3. **Performance Issues**: Monitor resource usage and adjust server configuration
4. **Embedding Generation**: Large content sets may take time to process initially

### Health Checks
Use the `/health` endpoint to verify all services are connected and operational.
