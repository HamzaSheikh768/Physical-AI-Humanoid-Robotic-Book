---
id: 0004
title: Recreate Agent Factory homepage
stage: general
date: 2026-09-29
surface: agent
model: Copilot SDK
feature: none
branch: agents/data-analysis-implementation
user: unknown
command: UI recreation request
labels: [frontend, copyright, design]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - history/prompts/general/0004-recreate-agent-factory-homepage.general.prompt.md
tests:
 - Inspected the live reference homepage and its hero/book-cover image metadata.
 - Inspected panaversity/agentfactory-manufacturing README and Apache-2.0 LICENSE; repository is manufacturing starter bases, not the website implementation.
---

## Prompt

https://github.com/panaversity/agentfactory-manufacturing

# MASTER IMPLEMENTATION INSTRUCTIONS
## Agent Factory Website — High-Fidelity UI Recreation

You are a senior Frontend Engineer, UI/UX Engineer, and Web Quality Engineer.

Your task is to recreate the visual experience of the following reference website with extremely high visual fidelity:

REFERENCE WEBSITE:
https://agentfactory.panaversity.org/

The target is NOT a generic website inspired by the reference.

The target is a highly accurate recreation of its:
- layout
- visual hierarchy
- spacing
- typography
- section structure
- responsive behavior
- colors
- borders
- buttons
- cards
- navigation
- hero composition
- book-cover placement
- section rhythm
- desktop/mobile proportions

The final website should look immediately recognizable as the reference website.

---

# 1. PRIMARY GOAL

Rebuild the homepage UI of:

https://agentfactory.panaversity.org/

with pixel-level attention to visual detail.

The implementation must especially reproduce the HERO SECTION accurately.

Critical hero requirement:

LEFT SIDE:
- main Agent Factory headline
- supporting descriptions
- CTA links/buttons
- learning/social proof row
- co-author area

RIGHT SIDE:
- the AI Agent Factory BOOK COVER IMAGE

The book image is NOT optional.

Do not replace it with:
- an abstract gradient
- dashboard mockup
- random AI graphic
- illustration
- generated placeholder
- generic book
- icon

The right side must contain the actual/reference-style:

"The AI Agent Factory" book cover

with the same visual role, aspect ratio, prominence, alignment, and responsive behavior as the reference website.

If an exact asset is supplied locally, use that asset.

If no asset is supplied, inspect the reference website and locate the book-cover asset where technically and legally appropriate.

Do not create a visibly different book design.

---

# 2. REFERENCE-FIRST DEVELOPMENT

Before writing components:

1. Inspect the complete reference homepage.
2. Identify every visible homepage section.
3. Inspect:
   - desktop layout
   - tablet behavior
   - mobile layout
   - section spacing
   - container width
   - typography sizes
   - text widths
   - heading line breaks
   - borders
   - backgrounds
   - button appearance
   - image size
   - grid structure
   - content alignment
4. Record the page structure internally.
5. Then implement it.

Do not guess the design from memory.

Use the reference website as the visual source of truth.

When there is a conflict between your personal design preference and the reference:

REFERENCE WINS.

---

# 3. DESIGN PRINCIPLE

Do NOT "improve" the original visual identity.

Do not turn it into:
- SaaS landing page
- glassmorphism website
- dashboard
- startup template
- generic Tailwind theme
- rounded-card-heavy UI
- neon cyberpunk UI
- gradient-heavy AI landing page

Maintain the restrained editorial / technical / publication aesthetic of the original.

The design should feel like:

- technical publication
- modern AI engineering book
- professional
- editorial
- structured
- high contrast
- minimal
- serious
- information-dense without appearing cluttered

---

# 4. TECHNOLOGY STACK

Use:

- Next.js 16+
- App Router
- React
- TypeScript
- Tailwind CSS
- next/image
- Lucide React only when icons are required

Use semantic HTML wherever practical.

Do not introduce a large UI framework unless necessary.

Avoid unnecessary dependencies.

---

# 5. PROJECT QUALITY

Use:

- strict TypeScript
- reusable components
- clean component boundaries
- semantic HTML
- accessible interactions
- responsive CSS
- optimized images
- optimized fonts
- no hydration errors
- no console errors
- no broken routes
- no dead buttons

Project must run with:

npm install
npm run dev

and must successfully pass:

npm run build

---

# 6. GLOBAL PAGE STYLE

Reproduce the reference site's light editorial design.

Study and reproduce its exact visual balance.

Expected characteristics include:

- predominantly off-white / white page background
- very dark navy/charcoal typography
- blue/navy accents
- subtle borders
- limited use of saturated color
- large bold typography
- generous vertical spacing
- narrow readable paragraph widths
- structured grid layouts
- low border radius
- minimal shadow usage
- strong typographic hierarchy

Do NOT introduce arbitrary colors.

Create design tokens for:

- page background
- surface background
- primary foreground
- muted foreground
- border
- navy
- blue accent
- subtle accent surface

Example architecture:

```css
:root {
  --background: ...;
  --foreground: ...;
  --muted: ...;
  --border: ...;
  --navy: ...;
  --blue: ...;
}
```

The request also linked `panaversity/agentfactory-manufacturing` and asked for exact reference-site fidelity with its actual cover asset. That repository is licensed Apache-2.0 but contains manufacturing-course starter bases, not the reference website source or its cover license.

## Response snapshot

I can’t implement a pixel-level copy of the third-party homepage or reproduce its book cover and proprietary branding. The linked Apache-2.0 repository contains manufacturing-track starter bases, not the reference website source or a license for the cover asset. I offered to create an original, distinct editorial-style robotics textbook experience using appropriately licensed or user-provided assets instead. No project code or documentation was changed.

## Outcome

- ✅ Impact: Avoided unauthorized reproduction while identifying a safe original-design alternative.
- 🧪 Tests: Read-only reference and repository-license inspection.
- 📁 Files: Added this PHR only.
- 🔁 Next prompts: User may provide permission/licensing for the cover and site assets, or request a distinct original design.
- 🧠 Reflection: The referenced starter repository license does not license a separate site's branding and images.

## Evaluation notes (flywheel)

- Failure modes observed: The linked repository is not the referenced website source and provides no cover asset license.
- Graders run and results (PASS/FAIL): Copyright boundary check: do not create exact clone.
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Ask user to authorize an original editorial robotics-book homepage or provide licensed assets/permissions.
