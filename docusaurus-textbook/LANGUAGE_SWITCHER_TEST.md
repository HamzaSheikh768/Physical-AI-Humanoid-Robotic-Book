# Language Switcher Authentication Test

## Test Cases for Language Switcher with Authentication

### Test 1: Unauthenticated User
- **Precondition**: User is not logged in
- **Action**: Click on language switcher in navbar
- **Expected Result**:
  - Language switcher appears disabled (grayed out)
  - Hover shows "Sign in to change language"
  - Clicking does nothing
  - No redirect to login page occurs

### Test 2: Authenticated User
- **Precondition**: User is logged in
- **Action**: Click on language switcher in navbar
- **Expected Result**:
  - Language switcher dropdown opens normally
  - Both English and Urdu options are available
  - Clicking on Urdu changes to Urdu locale
  - Clicking on English changes to English locale
  - No redirect to login page occurs

### Test 3: Language Persistence
- **Precondition**: User is logged in and has selected Urdu
- **Action**: Navigate to different pages
- **Expected Result**:
  - Urdu locale is maintained across pages
  - Language preference is preserved

### Test 4: RTL Support
- **Precondition**: Urdu locale is selected
- **Action**: View any page
- **Expected Result**:
  - Text is right-aligned
  - Layout is RTL-appropriate
  - Navigation elements are properly positioned for RTL

## Implementation Notes

The language switcher is implemented in:
- `src/theme/NavbarItem/LocaleDropdown.tsx` - Custom locale dropdown with auth check
- `docusaurus.config.ts` - Configuration for i18n with RTL support
- `i18n/ur/` - Translation files for Urdu locale

The authentication check is performed by:
1. Checking for 'better-auth.session' in localStorage
2. Conditionally rendering the dropdown based on auth status
3. Maintaining RTL support for Urdu locale