---
id: 0002
title: backend-rag-fix-plan
stage: plan
date: 2025-12-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-backend-rag-fix
branch: 001-backend-rag-fix
user: claude
command: /sp.plan Master Backend Fix & RAG Completion Execution Plan
labels: ["plan", "backend", "rag", "ai", "book-platform", "cohere", "qdrant"]
links:
  spec: "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/spec.md"
  ticket: null
  adr: null
  pr: null
files:
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/plan.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/research.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/data-model.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/quickstart.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/contracts/rag-api-contract.md
tests:

---

## Prompt

/sp.plan Master Backend Fix & RAG Completion Execution Plan

Owner:
Senior backend / ML engineer

Goal:
Stabilize, fix, and complete the FastAPI + Cohere + Qdrant + MCP based RAG backend so the chatbot works end-to-end in production.

--------------------------------------------------
PHASE 0 — Preconditions
--------------------------------------------------
- Ensure access to full repository
- Ensure valid .env with:
  - COHERE_API_KEY
  - QDRANT_URL
  - QDRANT_API_KEY
  - Any MCP-related variables
- Confirm Python virtual environment is created and activated
- Install dependencies inside venv only

Checkpoint:
- `python --version` correct
- `pip list` shows all required packages
- No global Python usage

--------------------------------------------------
PHASE 1 — Full Backend Audit
--------------------------------------------------
Steps:
1. Recursively read backend/ directory
2. Map:
   - Entry points
   - API routes
   - Embedding logic
   - Qdrant client usage
   - MCP initialization
3. Identify:
   - Broken imports
   - Async misuse (blocking calls, sync clients)
   - Dead or unused modules
   - Inconsistent config loading
4. Fix issues **in place** (no new files)

Checkpoint:
- Backend imports resolve
- No unused critical code paths
- Codebase is internally consistent

--------------------------------------------------
PHASE 2 — Environment & Config Validation
--------------------------------------------------
Steps:
1. Verify `.env` loading mechanism (dotenv / os.environ)
2. Replace any hardcoded:
   - API keys
   - URLs
   - Secrets
3. Ensure single source of truth for config

Checkpoint:
- Grep confirms no hardcoded secrets
- Missing env vars fail loudly with clear errors

--------------------------------------------------
PHASE 3 — MCP Server Stabilization
--------------------------------------------------
Steps:
1. Initialize Context7 MCP server correctly
2. Ensure lifecycle hooks are respected:
   - Startup
   - Shutdown
3. Verify no blocking calls or leaked resources

Checkpoint:
- MCP starts with backend
- Clean shutdown
- No runtime warnings

--------------------------------------------------
PHASE 4 — Embedding Pipeline Completion (CRITICAL)
--------------------------------------------------
Steps:
1. Audit existing embedding logic
2. Select correct Cohere embedding model
3. Validate expected vector dimension
4. Implement:
   - Proper chunking
   - Batch uploads
   - Async-safe API calls
   - Retry + failure handling
5. Run embedding for full book text

Checkpoint:
- All book chunks embedded
- No skipped or partial embeddings
- No API errors or silent failures

--------------------------------------------------
PHASE 5 — Qdrant Clean Rebuild
--------------------------------------------------
Steps:
1. Delete old Qdrant collection
2. Create new collection with:
   - Correct vector size
   - Correct distance metric
3. Upload all embedded vectors
4. Verify persistence

Checkpoint:
- Qdrant dashboard shows new collection
- Point count ~1000+ for ~4 chapters
- No dimension mismatch errors

--------------------------------------------------
PHASE 6 — Retrieval & RAG Validation
--------------------------------------------------
Steps:
1. Validate query embedding logic
2. Ensure Qdrant search returns relevant chunks
3. Feed retrieved context into LLM correctly
4. Prevent empty or irrelevant responses

Checkpoint:
- Queries return non-empty results
- Context length is reasonable
- Chatbot answers grounded in book content

--------------------------------------------------
PHASE 7 — System-Level Debugging
--------------------------------------------------
Steps:
1. Run FastAPI backend
2. Run React frontend simultaneously
3. Test chatbot using domain-specific queries only:
   - "What is Physical AI?"
   - "What is ROS2?"
   - "Explain nodes in ROS2?"
4. For errors:
   - Copy error
   - Trace via IDE search
   - Analyze conditions causing failure
   - Fix root cause

Checkpoint:
- No frontend-backend disconnect
- Errors resolved at source

--------------------------------------------------
PHASE 8 — Data Ingestion Verification
--------------------------------------------------
Steps:
1. Review ingestion scripts end-to-end
2. Validate:
   - Chunking logic
   - Loop boundaries
   - Batch limits
3. Re-run ingestion if needed

Checkpoint:
- Qdrant point count stable
- Ingestion reproducible

--------------------------------------------------
PHASE 9 — Cleanup Review (Permission-Based)
--------------------------------------------------
Steps:
1. Identify unused:
   - Files
   - Folders
   - Modules
2. Prepare a list with justification
3. Request explicit permission before deletion

Checkpoint:
- No files deleted without approval

--------------------------------------------------
PHASE 10 — Final Validation & Sign-Off
--------------------------------------------------
Steps:
1. Start backend with:
   uvicorn main:app
2. Confirm:
   - No runtime errors
   - MCP initialized
   - Embeddings complete
   - Qdrant populated
   - Retrieval works
3. Document:
   - Fixes applied
   - Decisions made
   - Remaining risks (if any)

Final Success Criteria:
- Backend is production-ready
- Chatbot reliably answers from stored book data
- No unverified assumptions
- No partial solutions

## Response snapshot

Created comprehensive implementation plan for backend audit and RAG system completion. The plan includes:

1. Technical Context:
   - Language: Python 3.12
   - Dependencies: FastAPI, Uvicorn, Cohere API, Qdrant Cloud, Context7 MCP server, Neon Postgres
   - Storage: Qdrant Cloud (vector embeddings), Neon Postgres (metadata)
   - Target: Web application backend service

2. Research Summary (research.md):
   - Technology stack decisions aligned with constitution
   - Cohere embedding model selection (embed-multilingual-v3.0)
   - Text chunking strategy (512-token chunks with 50-token overlap)
   - Qdrant configuration (1024 dimensions, cosine distance)
   - Async implementation patterns
   - Error handling strategy

3. Data Model (data-model.md):
   - Entity definitions for BookContent, Embedding, QdrantPoint, QueryRequest/Response
   - Relationships between entities
   - Validation rules
   - State transitions for content processing

4. API Contracts (contracts/rag-api-contract.md):
   - Cohere embedding API contract
   - Qdrant vector store API contract
   - RAG query API contract
   - Environment configuration requirements
   - Health check contract

5. Quickstart Guide (quickstart.md):
   - Prerequisites and setup instructions
   - Backend startup process
   - RAG pipeline execution
   - MCP server integration
   - Troubleshooting guide

The implementation plan is complete and ready for the tasks generation phase.

## Outcome

- ✅ Impact: Created comprehensive implementation plan with technical context, research, data model, API contracts, and quickstart guide for backend audit and RAG completion
- 🧪 Tests: No tests added yet, planning phase complete
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and rag-api-contract.md in feature directory
- 🔁 Next prompts: Ready to proceed with /sp.tasks to create implementation tasks
- 🧠 Reflection: The plan comprehensively covers all aspects of the backend audit and RAG completion, aligning with the project constitution and technical requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A - planning phase
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with /sp.tasks to create implementation tasks
