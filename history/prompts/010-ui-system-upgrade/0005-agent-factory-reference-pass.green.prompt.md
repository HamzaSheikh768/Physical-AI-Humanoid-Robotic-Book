## User Prompt

This is reference:
https://agentfactory.panaversity.org/

## Response Snapshot

- Used the Agent Factory marketing page as a structural reference for proof strips, mission-led messaging, named pillars, staged journeys, and a strong closing call-to-action.
- Adapted those patterns to the Physical AI textbook instead of copying business-specific content.
- Added a compact book-highlights proof strip with module, stack, language, and open-source signals.
- Added a “What makes this guide different” section with three robotics-specific pillars: embodied reasoning, simulation before risk, and a path to deployment.
- Preserved the existing workflow, system-view, and textbook CTA sections, links, dark visual tokens, responsive behavior, and reduced-motion handling.

## Files Changed

- `docusaurus-textbook/src/components/HomepageJourney.tsx`
- `docusaurus-textbook/src/css/HomepageJourney.module.css`

## Verification

- `npm.cmd --prefix docusaurus-textbook run typecheck`
- `npm.cmd --prefix docusaurus-textbook run build`
- English and Urdu static builds generated successfully.

## Stage

green
