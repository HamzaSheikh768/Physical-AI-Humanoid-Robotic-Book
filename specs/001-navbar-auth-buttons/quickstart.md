# Quickstart: Docusaurus Navbar Auth (Better Auth)

## Prerequisites

- Node.js 18+ installed
- Docusaurus project set up with v3
- Better Auth configured in your application
- TypeScript 5.0+ for type safety

## Installation Steps

### 1. Install Required Dependencies

```bash
cd docusaurus-textbook
npm install better-auth @better-auth/react
```

### 2. Create the AuthNavbarItem Component

Create the component structure:

```bash
mkdir -p src/components/AuthNavbarItem
touch src/components/AuthNavbarItem/index.tsx
touch src/components/AuthNavbarItem/index.ts
```

### 3. Implement the AuthNavbarItem Component

Create `src/components/AuthNavbarItem/index.tsx`:

```tsx
import React from 'react';
import { useSession } from '@better-auth/react';
import { NavbarItem } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';

interface AuthNavbarItemProps {
  position?: 'left' | 'right';
  className?: string;
}

const AuthNavbarItem: React.FC<AuthNavbarItemProps> = ({
  position = 'right',
  className = ''
}) => {
  const { session, signIn, signOut } = useSession();

  if (session?.value) {
    // Authenticated state - show logout button
    return (
      <NavbarItem className={className}>
        <button
          onClick={() => signOut()}
          className="navbar__link"
        >
          {translate({ id: 'theme.navbar.logout', message: 'Logout' })}
        </button>
      </NavbarItem>
    );
  } else {
    // Unauthenticated state - show sign in/up buttons
    return (
      <NavbarItem className={className}>
        <div className="navbar__auth-buttons">
          <button
            onClick={() => signIn()}
            className="navbar__link"
            style={{ marginRight: '1rem' }}
          >
            {translate({ id: 'theme.navbar.signin', message: 'Sign In' })}
          </button>
          <button
            onClick={() => signIn()} // For now, same as sign in, but could be different
            className="navbar__link button button--primary"
          >
            {translate({ id: 'theme.navbar.signup', message: 'Sign Up' })}
          </button>
        </div>
      </NavbarItem>
    );
  }
};

export default AuthNavbarItem;
```

Create `src/components/AuthNavbarItem/index.ts`:

```ts
export { default } from './index';
```

### 4. Update Docusaurus Configuration

Modify `docusaurus.config.ts` to include the auth navbar item:

```ts
// In your themeConfig.navbar.items array:
{
  type: 'custom-auth-navbar-item',
  position: 'right', // or 'left' based on your preference
  // Additional props can be added here
}
```

### 5. Create Custom Navbar Item Type

Create `src/theme/NavbarItem/CustomAuthNavbarItem.tsx`:

```tsx
import React from 'react';
import AuthNavbarItem from '../../components/AuthNavbarItem';

interface CustomAuthNavbarItemProps {
  position?: 'left' | 'right';
  className?: string;
}

const CustomAuthNavbarItem: React.FC<CustomAuthNavbarItemProps> = (props) => {
  return <AuthNavbarItem {...props} />;
};

export default CustomAuthNavbarItem;
```

### 6. Register the Custom Component Type

Update `src/theme/index.ts` or create as needed:

```ts
import NavbarItem from './NavbarItem';
import CustomAuthNavbarItem from './NavbarItem/CustomAuthNavbarItem';

export default {
  NavbarItem: {
    'custom-auth-navbar-item': CustomAuthNavbarItem,
  },
  // Other theme components...
};
```

## Better Auth Client Setup

Make sure Better Auth client is properly initialized in your Docusaurus app. This typically goes in a root layout or provider component:

```tsx
// In your app's root or in a provider component
import { BetterAuthProvider } from "@better-auth/react";

const App = () => {
  return (
    <BetterAuthProvider>
      {/* Your Docusaurus content */}
    </BetterAuthProvider>
  );
};
```

## Testing the Implementation

1. Start your Docusaurus development server:
```bash
cd docusaurus-textbook
npm run start
```

2. Visit your site and verify:
   - When not logged in: "Sign In" and "Sign Up" buttons appear in navbar
   - When logged in: "Logout" button appears in navbar
   - Clicking buttons triggers appropriate Better Auth flows
   - Navbar updates immediately when auth state changes

## Troubleshooting

### Common Issues

1. **Auth state doesn't update in navbar after login/logout**
   - Verify Better Auth client is properly initialized
   - Check that your app is wrapped with BetterAuthProvider

2. **Buttons don't appear in navbar**
   - Verify configuration in docusaurus.config.ts is correct
   - Check that custom component files are in correct locations

3. **TypeScript errors**
   - Ensure all dependencies are properly installed
   - Verify TypeScript version compatibility (5.0+)

## Next Steps

1. Customize button styling to match your site's design
2. Add user profile information display when authenticated
3. Implement separate sign-up flow if needed
4. Add loading states for better UX
5. Test across different devices and screen sizes