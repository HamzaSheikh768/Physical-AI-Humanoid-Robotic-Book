# AuthNavbarItem Component

This component provides authentication-aware navigation items for the Docusaurus navbar, using Better Auth for session management.

## Features

- Conditional rendering based on authentication state
- Sign In and Sign Up buttons for unauthenticated users
- Logout button for authenticated users
- Loading and error states
- Accessibility support
- Responsive design

## Usage

The component is integrated into the Docusaurus navbar via the theme extension system. It's configured in `docusaurus.config.ts` with the type `custom-auth-navbar-item`.

## Files

- `index.tsx` - Main component implementation with authentication state management
- `index.ts` - Export file
- `../NavbarItem/CustomAuthNavbarItem.tsx` - Theme extension wrapper
- `../../theme/index.ts` - Theme registration
- `/src/css/auth-navbar.css` - Component-specific styles

## Functionality

1. **Unauthenticated State**: Shows Sign In and Sign Up buttons
2. **Authenticated State**: Shows Logout button
3. **Loading State**: Shows loading indicator while determining auth status
4. **Error State**: Shows error messages when authentication fails
5. **Real-time Updates**: Updates immediately when auth state changes

## Accessibility

- Proper ARIA labels for all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Styling

- Responsive design that adapts to mobile screens
- Consistent with Docusaurus navbar styling
- Error state styling for feedback