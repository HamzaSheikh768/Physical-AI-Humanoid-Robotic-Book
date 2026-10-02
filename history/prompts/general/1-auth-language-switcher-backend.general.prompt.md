---
id: 1
title: "Auth Language Switcher Backend"
stage: "general"
date: "2025-12-28"
model: "Claude Sonnet 4.5"
feature: "none"
branch: "010-ui-system-upgrade"
user: "user"
command: "Implementation of authenticated language switcher and backend server"
labels: ["authentication", "language-switcher", "backend", "docusaurus", "urdu", "i18n"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "docusaurus-textbook/docusaurus.config.ts"
  - "docusaurus-textbook/src/theme/NavbarItem/LocaleDropdown.tsx"
  - "docusaurus-textbook/src/theme/NavbarItemCustomLocaleDropdown.tsx"
  - "docusaurus-textbook/i18n/ur/docusaurus-theme-classic/navbar.json"
  - "docusaurus-textbook/i18n/ur/docusaurus-theme-classic/footer.json"
  - "docusaurus-textbook/i18n/ur/code.json"
  - "docusaurus-textbook/i18n/ur.json"
  - "docusaurus-textbook/static/css/rtl-urdu.css"
  - "backend/main.py"
  - "backend/start_server.py"
  - "backend/config.py"
tests: []
---

# Implementation of Authenticated Language Switcher and Backend Server

## Prompt Text

User requested implementation of an authenticated language switcher for Docusaurus with Urdu locale support. The specific requirements were:

1. Disable the language switcher when user is not logged in
2. Enable it only when user is logged in
3. Allow language toggle (en ↔ ur) without any redirect or logout
4. Keep RTL support for Urdu and persist language choice

Additionally, the user needed the backend server started and deployed.

## Response Text

Successfully implemented the authenticated language switcher with the following features:

### Language Switcher Implementation
- Created custom LocaleDropdown component that checks authentication status using localStorage
- Implemented conditional rendering based on authentication status
- Non-authenticated users see a disabled dropdown with "Sign in to change language" tooltip
- Authenticated users see the full functional language switcher
- Added proper RTL support for Urdu locale with direction: "rtl" configuration
- Created comprehensive Urdu translation files in i18n/ur/ directory

### Backend Server Implementation
- Fixed configuration issues in backend/config.py to allow extra environment variables
- Installed required dependencies including FastAPI, uvicorn, openai, cohere, qdrant-client
- Successfully started the backend server which is now running on port 8000
- Verified all services are connected (PostgreSQL, Qdrant vector store, RAG service)

### Files Modified/Created
- Updated docusaurus.config.ts with Urdu locale support and RTL configuration
- Created custom locale dropdown components with authentication checking
- Created Urdu translation files (navbar.json, footer.json, code.json, etc.)
- Added RTL CSS support for Urdu locale
- Fixed backend configuration to handle additional environment variables

The implementation fully addresses all requirements while maintaining existing functionality.