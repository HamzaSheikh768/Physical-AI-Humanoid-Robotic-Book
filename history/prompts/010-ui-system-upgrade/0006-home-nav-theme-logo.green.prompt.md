## User Prompt

Add homepage inthe navber, footer, light / dark mode and Logo redesign

## Response Snapshot

- Added a Home link to the global navbar and footer navigation.
- Removed the homepage-only exclusions that previously hid the navbar and footer on `/`.
- Enabled a two-state light/dark mode switch with dark mode as the default and disabled system-only locking.
- Added a complete light-theme token set for page surfaces, text, borders, cards, navigation, footer, shadows, and docs UI.
- Replaced the previous robot mark with a new Physical AI geometric logo and used it for the navbar logo and favicon.
- Added focus, hover, and theme-aware styling for the navbar theme control.

## Files Changed

- `docusaurus-textbook/docusaurus.config.ts`
- `docusaurus-textbook/src/css/custom.css`
- `docusaurus-textbook/src/theme/Navbar.tsx`
- `docusaurus-textbook/src/theme/Footer/index.tsx`
- `docusaurus-textbook/static/img/physical-ai-logo.svg`

## Verification

- `npm.cmd --prefix docusaurus-textbook run typecheck`
- `npm.cmd --prefix docusaurus-textbook run build`
- English and Urdu static builds generated successfully.
- Built homepage contains navbar, footer, Home, logo, and theme-switch markup.

## Stage

green
