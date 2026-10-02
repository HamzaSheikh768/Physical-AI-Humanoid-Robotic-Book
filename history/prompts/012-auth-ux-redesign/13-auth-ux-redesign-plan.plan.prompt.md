---
id: 13
title: auth-ux-redesign-plan
stage: plan
date: 2025-12-28
model: sonnet
feature: auth-ux-redesign
branch: 012-auth-ux-redesign
user: Claude
command: /sp.plan "Project: Authentication & Onboarding UX Upgrade..."
labels: ["authentication", "ux", "onboarding", "plan", "framer-motion"]
links:
  spec: "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/012-auth-ux-redesign/spec.md"
  plan: "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/012-auth-ux-redesign/plan.md"
  pr: null
  ticket: null
  adr: null
files:
  - "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/012-auth-ux-redesign/plan.md"
  - "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/012-auth-ux-redesign/research.md"
  - "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/012-auth-ux-redesign/data-model.md"
  - "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/012-auth-ux-redesign/quickstart.md"
  - "/mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/012-auth-ux-redesign/contracts/auth-api-contract.md"
tests: []
prompt: |
  Project: Authentication & Onboarding UX Upgrade

  Phase 1: Route & Navigation Cleanup
  - Separate Login and Sign Up into distinct routes
  - Fix navbar auth spacing and labeling
  - Highlight primary auth action (Sign Up)

  Phase 2: Page Layout & Hierarchy
  - Increase page heading size significantly
  - Add short descriptive subtitle under headings
  - Constrain form width for readability
  - Introduce vertical rhythm and spacing

  Phase 3: Signup Form Decomposition
  - Split signup form into logical sections:
    - Account credentials
    - Learning background
  - Visually de-emphasize optional fields
  - Prevent initial overwhelm

  Phase 4: Input & Form UX
  - Increase input height and padding
  - Improve focus and hover states
  - Use placeholders only as examples
  - Ensure labels remain visible

  Phase 5: Validation & Messaging
  - Client-side validation for empty fields
  - Server-side validation for duplicate email
  - Inline error messages near affected fields
  - Friendly guidance for corrective action

  Phase 6: Loading & Feedback States
  - Disable submit button during processing
  - Show loading indicator in button
  - Prevent double submission

  Phase 7: Animation Layer
  - Apply Framer Motion page transitions:
    - opacity: 0 → 1
    - y: 16 → 0
  - Animate error messages and helper text
  - Add subtle CTA hover and tap feedback

  Phase 8: Post-Signup Transition
  - Smooth redirect after successful signup
  - Optional welcome feedback
  - Ensure navbar auth state updates instantly

  Phase 9: Accessibility & Responsiveness
  - Ensure keyboard navigation works end-to-end
  - Optimize tap targets for mobile
  - Stack and collapse fields on small screens

  Deliverables:
  - Refined Login page
  - Refined Create Account page
  - Improved navbar auth UX
  - Robust validation and feedback system

  Completion criteria:
  - Headings dominate visual hierarchy
  - Signup errors are obvious and helpful
  - Duplicate email handling is clear
  - Auth experience feels professional and calm

response: |
  Successfully completed the planning phase for the Authentication & Onboarding UX Redesign. The following artifacts were created:

  1. Implementation Plan (plan.md):
     - Detailed technical context with TypeScript, React, Docusaurus, and Framer Motion
     - Constitution check confirming compliance with project principles
     - Project structure outlining component organization

  2. Research Document (research.md):
     - Key decisions on authentication architecture using Better Auth
     - Animation library choice (Framer Motion as required)
     - Form structure and visual hierarchy approaches
     - Validation and accessibility strategies

  3. Data Model (data-model.md):
     - User Account entity with email/password validation
     - User Profile entity with learning background fields
     - Authentication Session entity for state management
     - Validation rules and state transitions

  4. Quickstart Guide (quickstart.md):
     - Installation steps and prerequisites
     - Component structure and implementation points
     - Visual hierarchy and form decomposition guidance
     - Animation and validation implementation details

  5. API Contracts (contracts/auth-api-contract.md):
     - Authentication endpoint specifications
     - Component interface definitions
     - Error handling contract
     - Performance and validation requirements

  6. Agent Context Update:
     - Updated CLAUDE.md with new technology stack information
     - Added TypeScript, React, Docusaurus, Framer Motion, and Better Auth to context

  All Phase 0 and Phase 1 planning requirements have been completed successfully.
outcome: Planning phase completed with all required artifacts
evaluation: All planning artifacts created successfully and aligned with requirements
---
