<!-- SYNC IMPACT REPORT
Version change: 1.1.0 → 1.2.0 (added Auth & Onboarding specification)
List of modified principles: None
Added sections: Authentication & Onboarding Principles
Removed sections: None
Templates requiring updates: ⚠ .specify/templates/plan-template.md, ⚠ .specify/templates/spec-template.md, ⚠ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# AI / Spec-Driven Book: Physical AI & Humanoid Robotics Constitution

## Core Principles

### Docusaurus-First Content Structure
All content must follow Docusaurus docs folder structure with sequential numbering. Use .md or .mdx files with consistent heading hierarchy (# for module, ## for chapters, ### for sections).

### Spec-Driven Development Governance
All content creation and updates must align with /sp.specify, /sp.plan, and /sp.constitution. Change control requires updating these governance documents when scope, tools, or structure changes.

### Quality and Verification (NON-NEGOTIABLE)
All factual claims must be traceable through verified sources. Code runs as documented, simulations respect real-world physics, and learning outcomes align with labs and assessments. Zero plagiarism tolerance.

### Tooling Mandate
Mandatory use of Docusaurus (TypeScript) for book authoring, GitHub Pages for deployment, Spec-Kit Plus for specification governance, and Claude Code for assisted authoring with human validation required.

### Academic Standards
Citation style: APA. Engineering clarity for CS/Robotics audience. Physical realism over theory-only claims. Accuracy through verified sources.

### Content Structure Compliance
All files must follow Docusaurus docs folder structure with sequential and descriptive filenames to maintain order.

## Technology and Standards Requirements

Mandatory tooling: Docusaurus (TypeScript), GitHub Pages, Spec-Kit Plus, Claude Code. Standards: APA citation style, reproducible simulations and code, accuracy through verified sources.

## Development Workflow

Use Spec-Kit Plus commands (/sp.specify, /sp.plan, /sp.tasks) for specification governance. Human validation required for Claude Code assistance. Follow Docusaurus authoring guidelines with proper file structure.

## Governance

Constitution supersedes all other practices. Amendments require documentation via /sp.constitution command. All content must comply with this constitution. Changes to scope, tools, or structure require updating /sp.constitution, /sp.specify, and /sp.plan.

**Version**: 1.0.0 | **Ratified**: 2025-12-14 | **Last Amended**: 2025-12-14

# Physical AI & Humanoid Robotics – AI-Native Textbook Constitution

## Core Principles

### Docusaurus-First Content Structure
All content must follow Docusaurus docs folder structure with sequential numbering. Use .md or .mdx files with consistent heading hierarchy (# for module, ## for chapters, ### for sections). Additionally, content must enable semantic search capabilities by supporting Cohere embedding generation and Qdrant vector storage.

### Spec-Driven Development Governance
All content creation and updates must align with /sp.specify, /sp.plan, and /sp.constitution. Change control requires updating these governance documents when scope, tools, or structure changes.

### Quality and Verification (NON-NEGOTIABLE)
All factual claims must be traceable through verified sources. Code runs as documented, simulations respect real-world physics, and learning outcomes align with labs and assessments. Zero plagiarism tolerance. All RAG responses must be traceable to specific book content with proper citations.

### Tooling Mandate
Mandatory use of Docusaurus (TypeScript) for book authoring, GitHub Pages for deployment, Spec-Kit Plus for specification governance, and Claude Code for assisted authoring with human validation required. For RAG functionality, integrate FastAPI + Uvicorn for backend, Cohere for embeddings, Qdrant for vector search, Neon Postgres for metadata, and OpenAI ChatKit for LLM generation.

### Academic Standards
Citation style: APA. Engineering clarity for CS/Robotics audience. Physical realism over theory-only claims. Accuracy through verified sources.

### Content Structure Compliance
All files must follow Docusaurus docs folder structure with sequential and descriptive filenames to maintain order.

## RAG Chatbot Module Principles

### Backend Architecture Governance

#### FastAPI + Uvicorn Standards
All backend endpoints must use FastAPI with Uvicorn ASGI server. Implement proper type hints, async/await patterns, and structured logging. API endpoints for `/query` and `/highlight-query` must follow RESTful principles with proper error handling.

#### Cohere Embedding Pipeline
All book content must be processed through Cohere embedding pipeline with proper chunking strategy. Embeddings must be stored in Qdrant vector database with corresponding metadata in Neon Postgres. Implement proper error handling and retry logic for API calls.

#### Data Management and Storage
Use Neon Serverless Postgres for book content and metadata storage. Use Qdrant Cloud for vector storage. Implement proper data validation, backup strategies, and migration procedures. All sensitive data must be stored in environment variables.

### Frontend Integration Standards

#### Docusaurus Chat Widget
The RAG chat widget must be seamlessly integrated into Docusaurus frontend with proper React/TypeScript implementation. Support text selection and context-aware multi-turn conversations. Follow accessibility standards and responsive design principles.

#### User Experience Requirements
Provide fast, context-aware responses with proper loading states. Implement proper error handling for network issues. Maintain conversation history and support text highlighting for targeted queries.

## Authentication & Onboarding Principles

### Authentication Stack Governance
All authentication must use **Next.js (App Router) + TypeScript** with **Better Auth** as the primary provider. Session strategy must be cookie-based sessions with profile storage in application database (separate from auth). Auth is responsible **only for identity**. Personalization data is handled by the application.

### Signup & Signin Flow Requirements
The signup flow must follow: 1) User enters email + password, 2) Account created via Better Auth, 3) User redirected to onboarding, 4) Background questions collected, 5) Profile persisted, 6) Redirect to dashboard. The signin flow must follow: 1) User authenticates, 2) Session restored, 3) If profile missing → onboarding, 4) Else → dashboard.

### User Background Profiling (Mandatory)
User onboarding must collect mandatory background information: Software background (skill level: BEGINNER | INTERMEDIATE | ADVANCED, known languages: Python, JavaScript, C++, Other), Hardware background (electronics experience: NONE | BASIC | INTERMEDIATE | ADVANCED, boards used: Arduino, ESP32, Raspberry Pi), and Learning Intent (track: SOFTWARE_ONLY, HARDWARE_ONLY, FULL_ROBOTICS). This data is used to personalize content visibility and sequencing.

### Better Auth Configuration Standards
Better Auth must be configured with emailAndPassword enabled and cookie-based sessions. Configuration must follow security best practices and integrate properly with the Next.js application router.

### Animated UI Constitution (CSS)
All authentication and onboarding UI must follow specific design principles: minimal, motion-driven feedback, no third-party animation libraries, hardware-accelerated transforms only. Form containers must use cardEnter animation (600ms ease-out), input fields must have focus states with border highlighting, buttons must have hover/active states with transforms, and loading states must include spin animations.

#### Form Container Animation
Auth cards must have backdrop-filter blur effect, rounded corners, and enter animation with opacity and transform transitions.

#### Input Field Animation
Input fields must have proper padding, border styling, background with transparency, and focus states with border color changes and box shadows.

#### Button Animation
Buttons must have gradient backgrounds, hover states with translateY and box shadows, and active states with scale transforms.

#### Loading State Animation
Loading buttons must have disabled pointer events, opacity changes, and spinning indicators.

### Enforcement Rules
Signup and Signin must use identical animation tokens. No inline styles allowed. Motion must not exceed 600ms. All auth screens must be keyboard accessible.

### Personalization Contract
Content engines must consume profile data before rendering: BEGINNER → show foundations, HARDWARE_ONLY → hide AI/ML, FULL_ROBOTICS → unlock ROS, sensors, control loops.

### GitHub Actions Workflow Requirements
Authentication-related workflows must include: `ci.yml` for build and type safety checks, `auth-check.yml` for constitution compliance verification, and `deploy.yml` for production deployment. All workflows must pass before merge or deploy, and no direct commits to main without workflows.

## Technology and Standards Requirements

Mandatory tooling: Docusaurus (TypeScript), GitHub Pages, Spec-Kit Plus, Claude Code. For RAG functionality: FastAPI, Uvicorn, Cohere, Qdrant, Neon Postgres, OpenAI ChatKit. For authentication: Next.js, Better Auth, TypeScript. Standards: APA citation style, reproducible simulations and code, accuracy through verified sources.

## Development Workflow

Use Spec-Kit Plus commands (/sp.specify, /sp.plan, /sp.tasks) for specification governance. Human validation required for Claude Code assistance. Follow Docusaurus authoring guidelines with proper file structure. Implement CI/CD with automated testing, linting, and deployment for both frontend and backend components. Authentication flows must follow the defined signup/signin patterns with proper user onboarding.

## Governance

Constitution supersedes all other practices. Amendments require documentation via /sp.constitution command. All content must comply with this constitution. Changes to scope, tools, or structure require updating /sp.constitution, /sp.specify, and /sp.plan.

**Version**: 1.2.0 | **Ratified**: 2025-12-14 | **Last Amended**: 2025-12-18

# Project Constitution

**Version:** 1.0.0
**Ratification Date:** 2025-12-27
**Last Amended Date:** 2025-12-27

## Core Principles

### Principle 1: User Empowerment Through Personalization
User empowerment through personalization options at chapter starts. The system MUST provide personalization controls to users at the beginning of each chapter. This enables users to customize their learning experience according to their preferences and needs.

### Principle 2: Multilingual Accessibility
Multilingual accessibility with on-demand translation to Urdu. The platform MUST support on-demand translation features, specifically to Urdu, to ensure content accessibility for diverse user groups. Translation accuracy MUST be verified against standard linguistic sources.

### Principle 3: Intuitive Interface Design
Intuitive interface using buttons for feature activation. The system MUST implement standardized button placement and functionality for feature activation, specifically positioned at the beginning of each chapter to ensure user-friendly navigation and feature discovery.

### Principle 4: Privacy Respect for Customizations
Privacy respect for logged-in user customizations. The system MUST ensure that user personalization preferences are stored securely and respect user privacy, particularly for authenticated users whose customizations need to persist across sessions.

## Key Standards

### Standard 1: Authentication Requirements
Personalization must be available only to authenticated users. The system MUST verify user authentication status before enabling personalization features to ensure proper access control and data privacy.

### Standard 2: Translation Quality Assurance
Translation accuracy to Urdu verified against standard linguistic sources. All translation functionality MUST be validated against recognized linguistic standards to ensure accuracy and cultural appropriateness.

### Standard 3: Feature Placement Consistency
Button placement standardized at the beginning of each chapter. All interactive features MUST be positioned consistently at the beginning of each chapter to maintain predictable user experience.

### Standard 4: Seamless User Experience
Feature implementation must ensure seamless user experience without page reloads. All interactive features MUST function without requiring full page reloads to maintain smooth user interaction and reduce latency.

### Standard 5: Cross-Platform Compatibility
Compatibility across web and mobile platforms. The system MUST function consistently across different platforms and devices to ensure universal accessibility.

## Constraints

### Constraint 1: Personalization Scope Limitation
Personalization limited to text content modifications. The system MUST restrict personalization features to text-based content modifications and not extend to structural or navigational changes.

### Constraint 2: Translation Language Scope
Translation support initially for Urdu only. The system MUST focus translation capabilities on Urdu language support initially, with potential for expansion in future versions.

### Constraint 3: Content Length Limitations
Maximum chapter length: 10,000 words per chapter. The system MUST enforce content length limitations to ensure optimal performance and user engagement.

### Constraint 4: Data Privacy Compliance
User data storage compliant with GDPR. All user data handling MUST comply with General Data Protection Regulation requirements to ensure legal compliance and user privacy.

### Constraint 5: Development Timeline
Development timeline: 3-6 months. The project MUST be completed within the specified timeframe to meet stakeholder expectations and market demands.

## Success Criteria

### Criterion 1: User Satisfaction with Personalization
90% user satisfaction in personalization usability tests. The system MUST achieve a minimum 90% satisfaction rating in usability tests related to personalization features.

### Criterion 2: Translation Accuracy Verification
Accurate Urdu translations confirmed by native speakers. All translated content MUST be verified by native Urdu speakers to ensure linguistic and cultural accuracy.

### Criterion 3: Feature Functionality Reliability
Zero critical bugs in button functionality. The system MUST have zero critical bugs in button functionality to ensure reliable user interaction.

### Criterion 4: Authentication System Deployment
Successful deployment with logged user authentication. The system MUST successfully implement and deploy user authentication functionality to enable personalized experiences.

### Criterion 5: Feature Integration Quality
Positive feedback on feature integration in chapters. The system MUST receive positive user feedback regarding the integration and usability of features within chapters.

## Additional Technical Principles

### Principle 5: Open Source and Community Collaboration
The project MUST embrace open source principles and encourage community collaboration. All code contributions MUST follow established coding standards and undergo proper review processes to maintain quality and consistency.

### Principle 6: AI and Robotics Integration Standards
AI and robotics integration MUST follow industry best practices and safety standards. The system MUST ensure that all AI models and robotics simulations are properly validated and tested before deployment.

### Principle 7: Scalable Architecture Design
The system MUST be designed with scalability in mind. Architecture decisions MUST consider future growth, performance requirements, and the ability to handle increasing user loads and content complexity.

### Principle 8: Documentation and Knowledge Sharing
Comprehensive documentation MUST be maintained for all system components. Knowledge sharing practices MUST be established to ensure project continuity and onboarding of new contributors.

## Development Standards

### Standard 6: Code Quality and Testing
All code MUST include appropriate unit tests with minimum 80% coverage. Code quality MUST be maintained through automated linting, code reviews, and continuous integration practices.

### Standard 7: Security and Safety Protocols
Security and safety protocols MUST be implemented throughout the system. All AI and robotics components MUST undergo security reviews and safety validation before deployment.

### Standard 8: Performance Optimization
Performance optimization MUST be a priority throughout development. System response times MUST meet defined SLAs and resource utilization MUST be optimized for efficiency.

### Standard 9: Cross-Platform Development
Cross-platform development practices MUST be followed to ensure compatibility across different operating systems, hardware configurations, and deployment environments.

### Standard 10: Continuous Integration and Deployment
Continuous integration and deployment practices MUST be implemented. All changes MUST pass automated testing before being merged and deployed to production environments.

## Additional Constraints

### Constraint 6: Hardware Compatibility
The system MUST be compatible with common robotics hardware platforms including ROS 2, NVIDIA Isaac, and Gazebo simulator. Hardware-specific implementations MUST maintain abstraction layers for portability.

### Constraint 7: Performance Requirements
System performance MUST meet defined benchmarks including response times under 2 seconds for user interactions and simulation updates at minimum 30 FPS for real-time applications.

### Constraint 8: Resource Limitations
The system MUST operate within defined resource constraints including memory usage under 4GB for core applications and CPU utilization under 80% during normal operations.

### Constraint 9: Dependency Management
External dependencies MUST be carefully managed and regularly updated. All dependencies MUST be vetted for security vulnerabilities and licensing compliance.

### Constraint 10: Data Storage Limits
Data storage MUST be optimized with defined limits for user data, simulation logs, and model storage to ensure system scalability and performance.

## Additional Success Criteria

### Criterion 6: Technical Implementation Quality
95% code coverage in automated tests. The system MUST maintain high code quality standards with comprehensive test coverage and continuous integration metrics.

### Criterion 7: System Performance
Sub-2 second response times for all user interactions. The system MUST meet defined performance benchmarks consistently under normal load conditions.

### Criterion 8: Community Engagement
Active community participation with 50+ contributors within 6 months. The project MUST foster community engagement through clear documentation and contribution guidelines.

### Criterion 9: Hardware Integration Success
Successful integration with 3+ major robotics platforms. The system MUST demonstrate compatibility with key robotics frameworks and hardware platforms.

### Criterion 10: Educational Impact
Measurable educational outcomes with 80%+ user completion rates for learning modules. The system MUST demonstrate effectiveness in achieving educational objectives.

## Governance

### Amendment Procedure
Changes to this constitution require explicit approval from project stakeholders and MUST be documented with proper versioning and change logs.

### Versioning Policy
This constitution follows semantic versioning principles where major versions indicate significant principle changes, minor versions indicate new principles or standards, and patch versions indicate clarifications or corrections.

### Compliance Review
Regular compliance reviews MUST be conducted to ensure ongoing adherence to all constitutional principles, standards, and constraints.

## Implementation Guidelines

### Guideline 1: Progressive Enhancement
All features MUST be implemented using progressive enhancement principles. Core functionality MUST be available to all users regardless of their device capabilities, with enhanced features added based on capability detection.

### Guideline 2: Accessibility Standards
All user interfaces MUST comply with WCAG 2.1 AA accessibility standards. The system MUST be usable by individuals with disabilities and support assistive technologies.

### Guideline 3: Internationalization Support
The system MUST be designed with internationalization in mind from the ground up. All user-facing text MUST be externalized and support multiple language translations beyond Urdu.

### Guideline 4: Performance Budgets
Performance budgets MUST be established and monitored for all system components. Page load times MUST not exceed 3 seconds on 3G connections, and interactive elements MUST respond within 100 milliseconds.

### Guideline 5: Data Privacy by Design
Privacy considerations MUST be integrated into all system designs from the initial planning phase. All data collection MUST follow privacy-by-design principles and provide users with clear control over their personal information.
