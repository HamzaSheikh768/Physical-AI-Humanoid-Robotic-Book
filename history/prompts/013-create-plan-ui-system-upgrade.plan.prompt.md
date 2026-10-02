---
id: 013
title: Create Plan UI System Upgrade
stage: plan
date: 2025-12-25
surface: agent
model: Claude Sonnet 4.5
feature: ui-system-upgrade
branch: 010-ui-system-upgrade
user: Claude Code
command: /sp.plan
labels: [plan, docusaurus, ui, hero-component]
links:
  spec: /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/010-ui-system-upgrade/spec.md
  plan: /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/010-ui-system-upgrade/plan.md
  ticket: null
  adr: null
  pr: null
files:
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/010-ui-system-upgrade/plan.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/010-ui-system-upgrade/research.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/010-ui-system-upgrade/data-model.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/010-ui-system-upgrade/quickstart.md
 - /mnt/e/Hackathon 1/Physical-AI-Humanoid-Robotic-Book/specs/010-ui-system-upgrade/contracts/hero-component.md
tests:
 - plan validation completed
 - constitution check passed
---

## Prompt

```
Instruction: docusaurus-textbook directory inthe all work, /sp.plan Reusable Hero Component and UI System Upgrade for Docusaurus

Objective:
Standardize and upgrade the visual system of the Docusaurus site by implementing a reusable Hero component, enforcing a true black body background, redesigning feature cards, and ensuring pixel-perfect visual consistency across all primary pages.

Scope:
- Implement a reusable Hero component as the single source of truth
- Enforce a global black body background across the site
- Redesign feature cards to match the premium, AI-first aesthetic
- Align all upgraded sections with the reference hero design
- Establish a consistent UI foundation for future pages

Phases:

Phase 1 — Audit & Design Baseline
- Audit all pages for hero sections, feature cards, and background inconsistencies
- Identify deviations from the reference visual style
- Define black background usage and contrast rules
- Document required design tokens:
  - Colors (primary blue, white, muted text, true black)
  - Typography scales
  - Spacing units
  - Card elevation and border treatments

Phase 2 — Component & System Specification
- Define Hero component API:
  - Title, highlighted text segments
  - Description text
  - Primary and secondary CTAs
  - Image source, alt text, alignment
- Define Hero layout rules:
  - Max-width and grid ratios
  - Vertical rhythm and spacing
- Define typography standards:
  - Heading hierarchy
  - Line heights and letter spacing
- Define background system:
  - Global body background set to true black
  - Section-level gradient overlays where required
- Define Feature Card component spec:
  - Card dimensions and padding
  - Border radius and subtle borders
  - Hover states and elevation
  - Icon/image placement
  - Title and description typography

Phase 3 — Implementation
- Implement reusable Hero component using existing project conventions
- Implement redesigned Feature Card component
- Apply global body background changes safely
- Ensure styles are scoped and reusable
- Avoid duplicate components or unused CSS

Phase 4 — Refactor Existing Pages
- Replace all hard-coded hero sections with the Hero component
- Replace legacy feature cards with the new card component
- Ensure visual consistency across homepage and secondary pages
- Maintain existing responsive behavior

Phase 5 — Validation & Quality Assurance
- Verify pixel-level parity between reference and updated sections
- Validate contrast and readability on black background
- Confirm consistent card spacing, shadows, and hover behavior
- Ensure navbar, footer, and content spacing remain intact
- Confirm successful production build

Deliverables:
- Reusable Hero component
- Reusable Feature Card component
- Global black background implementation
- Updated pages using new components
- UI system documentation and usage guidelines

Constraints:
- Framework: Docusaurus
- Styling: Existing CSS / CSS Modules system
- No new branding or color palette changes
- No duplicate files or components
- Desktop-first visual parity required

Out of Scope:
- Mobile-first redesign beyond current layouts
- Animations or motion-heavy effects
- Backend or content architecture changes
- New images or visual assets
```

## Response snapshot

Successfully created the implementation plan for the UI System Upgrade feature, including:

1. Filled out the implementation plan with technical context, constitution check, and project structure
2. Created research.md documenting key decisions for the reusable Hero component, true black background, and feature card redesign
3. Created data-model.md defining component interfaces for HeroSection, FeatureCard, and FeatureSection components
4. Created quickstart.md with usage instructions for the new components
5. Created contracts/hero-component.md with the API contract for the Hero component
6. Updated agent context to include the new technologies (TypeScript, React 18+, Docusaurus v3, etc.)

The plan aligns with the feature specification and constitution requirements, focusing on creating reusable components that maintain visual consistency while implementing the required true black background and modern AI-first aesthetic.

## Outcome

- ✅ Impact: Created comprehensive implementation plan for UI system upgrade with reusable components
- 🧪 Tests: Plan validation and constitution check completed successfully
- 📁 Files: Created plan.md, research.md, data-model.md, quickstart.md, and contracts
- 🔁 Next prompts: Ready for task generation phase (/sp.tasks) to implement the planned UI enhancements
- 🧠 Reflection: Plan follows best practices with proper component architecture and maintains compliance with project constitution

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All validation criteria met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task generation phase to implement the specified UI components