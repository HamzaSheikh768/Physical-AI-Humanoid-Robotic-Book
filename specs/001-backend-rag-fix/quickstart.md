# Quickstart Guide: Backend Audit & RAG System

## Prerequisites

- Python 3.12+
- Virtual environment tool (venv, conda, etc.)
- Cohere API key
- Qdrant Cloud account and credentials
- Git

## Setup

### 1. Clone and Setup Environment
```bash
git clone <repository-url>
cd <repository-name>
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file in the backend directory:
```env
COHERE_API_KEY=your_cohere_api_key_here
QDRANT_URL=your_qdrant_cluster_url
QDRANT_API_KEY=your_qdrant_api_key
```

## Backend Startup

### 1. Start the Backend Service
```bash
cd backend
uvicorn main:app --reload
```

The service will start on `http://localhost:8000`

### 2. Verify Service Health
```bash
curl http://localhost:8000/health
```

## RAG Pipeline Execution

### 1. Process Book Content
```bash
# Run the embedding pipeline to process book content
python -m scripts.embed_content
```

### 2. Query the System
```bash
curl -X POST http://localhost:8000/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is Physical AI?",
    "top_k": 5
  }'
```

## MCP Server Integration

The Context7 MCP server will be initialized automatically when the backend starts. Verify MCP functionality:
```bash
# Check if MCP server is running and integrated
curl http://localhost:8000/health
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loaded**
   - Ensure `.env` file is in the backend directory
   - Verify all required environment variables are set

2. **Cohere API Connection Issues**
   - Verify API key is correct
   - Check network connectivity to Cohere API

3. **Qdrant Connection Issues**
   - Verify Qdrant URL and API key
   - Check if Qdrant cluster is active

4. **Embedding Dimension Mismatch**
   - Ensure Cohere embedding model matches Qdrant collection configuration
   - Verify both are using 1024-dimensional vectors

## Development Workflow

### 1. Backend Audit Process
Run the backend audit script to identify issues:
```bash
python -m scripts.audit_backend
```

### 2. Testing
Run the test suite:
```bash
pytest tests/
```

### 3. Validation
Verify the complete RAG pipeline:
```bash
# Test query functionality
python -m scripts.validate_rag
```