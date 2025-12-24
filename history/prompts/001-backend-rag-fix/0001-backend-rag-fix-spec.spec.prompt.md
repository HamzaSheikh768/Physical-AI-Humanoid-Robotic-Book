---
id: 0001
title: backend-rag-fix-spec
stage: spec
date: 2025-12-24
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-backend-rag-fix
branch: 001-backend-rag-fix
user: claude
command: /sp.specify Master Backend Fix & RAG Completion for Book Chatbot Platform
labels: ["spec", "backend", "rag", "ai", "book-platform"]
links:
  spec: "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/spec.md"
  ticket: null
  adr: null
  pr: null
files:
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/spec.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/001-backend-rag-fix/checklists/requirements.md
tests:

---

## Prompt

/sp.specify Master Backend Fix & RAG Completion for Book Chatbot Platform

Target audience:
Senior backend / ML engineers responsible for stabilizing and finalizing a production RAG system.

Objective:
Fully audit, fix, update, and complete the backend of a technical book platform with an integrated chatbot.
The system must work end-to-end with production-grade reliability using FastAPI, Cohere embeddings, Qdrant Cloud, and MCP servers.

Scope of work:

1. Full Backend Audit
- Recursively read and understand the entire backend/ directory
- Inspect all files, subdirectories, configurations, imports, and dependencies
- Identify and fix:
  - Runtime errors
  - Async misuse
  - Broken or circular imports
  - Dead or unused code paths
  - Inconsistent configuration usage
- Modify existing files in place
- Do NOT create duplicate files or folders

2. Environment & Credentials Management
- Run backend strictly inside a Python virtual environment
- All secrets must be loaded from .env:
  - Cohere API key
  - Qdrant URL
  - Qdrant API key
  - Any additional tokens
- No hardcoded credentials anywhere in the codebase
- Validate that environment variables are correctly loaded and consistently used

3. Runtime & MCP Server
- Initialize and run Context7 MCP server correctly
- Ensure MCP lifecycle is stable and does not leak resources
- Backend must start cleanly with:
  uvicorn main:app
- No warnings, no runtime errors, no silent failures

4. Embeddings (CRITICAL)
- Complete embeddings for the full book text
- Use Cohere Embeddings API (not CLI, not OpenAI)
- Ensure:
  - Correct embedding model
  - Correct vector dimension
  - Proper chunking and batching
  - Async-safe implementation
  - Robust retry and failure handling
- No partial or missing embeddings allowed

5. Qdrant Vector Store
- Delete the existing Qdrant collection
- Create a new collection in a clean state
- Ensure:
  - Vector size matches Cohere embeddings
  - Distance metric is correctly configured
  - All book text chunks are successfully stored
  - Vectors are verifiably persisted
- Validation:
  - For ~4 chapters, expect ~1000+ points (approximate)
  - Confirm via Qdrant dashboard:
    Qdrant Database → Clusters → Manage Cluster → Point count

6. Retrieval & RAG Pipeline
- Ensure retrieval pipeline:
  - Queries Qdrant correctly
  - Returns relevant chunks
  - Feeds context properly into the chatbot
- Validate:
  - No empty retrieval results
  - No embedding dimension mismatches
  - No silent failures
- Chatbot responses must be grounded in stored book data

7. Debugging & Validation Workflow
- Run React frontend and FastAPI backend simultaneously
- Test chatbot using domain-specific questions only:
  - "What is Physical AI?"
  - "What is ROS2?"
  - "Explain nodes in ROS2?"
- Avoid generic greetings during validation
- For any error:
  - Copy full error message
  - Trace it via IDE search
  - Analyze relevant if-statements and try/except blocks
  - Identify the exact failure condition

8. Data Ingestion Verification
- Review and validate the data ingestion script
- Ensure no logical errors in:
  - Chunking
  - Loops
  - Batching
  - Upload calls
- Confirm ingestion success via Qdrant point counts

9. Cleanup (Permission Required)
- Identify unused:
  - Files
  - Folders
  - Modules
- Do NOT delete anything automatically
- Produce a list of unused items
- Request explicit permission before removal

Success criteria:
- Backend starts cleanly without errors
- MCP server initializes correctly
- Embeddings for full book are completed
- New Qdrant collection is populated and verified
- Retrieval returns relevant context
- Chatbot answers questions using stored book data
- System is production-ready end-to-end

Constraints:
- No placeholder code
- No mock data
- No duplicated files or folders
- No deletions without explicit permission
- Production-grade engineering decisions only

Not building:
- Frontend UI changes
- Authentication system changes
- Cost-optimization beyond free Cohere embeddings
- Experimental or research-only features

Output requirements:
- Apply fixes directly to the codebase
- Clearly explain what was fixed and why
- Document any engineering decisions made due to ambiguity
- No partial solutions
- No assumptions left unverified

## Response snapshot

Created comprehensive specification for the backend audit and RAG system completion. The specification includes:

1. User Scenarios & Testing with three prioritized user stories:
   - Technical Book Reader asks questions (P1)
   - System Administrator deploys stable backend (P2)
   - Developer validates complete book indexing (P3)

2. Functional Requirements (FR-001 through FR-010) covering:
   - Backend auditing and error fixing
   - Environment and credential management
   - MCP server initialization
   - Cohere embeddings generation
   - Qdrant vector store setup
   - RAG pipeline functionality

3. Key Entities including Book Content, Embeddings, Vector Store, RAG Pipeline, and Backend Service

4. Success Criteria (SC-001 through SC-008) with measurable outcomes for:
   - Backend stability
   - MCP server initialization
   - Complete embeddings
   - Qdrant collection verification
   - Retrieval pipeline functionality
   - Chatbot accuracy
   - Production readiness
   - Security (credential management)

The specification is complete and ready for the planning phase.

## Outcome

- ✅ Impact: Created comprehensive specification for backend audit and RAG system completion with clear requirements and success criteria
- 🧪 Tests: No tests added yet, specification phase complete
- 📁 Files: Created spec.md and requirements.md checklists in the feature directory
- 🔁 Next prompts: Ready to proceed with /sp.plan to create implementation plan
- 🧠 Reflection: The specification captures all requirements from the user description and is structured for easy implementation planning

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A - specification phase
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed with /sp.plan to create implementation plan
