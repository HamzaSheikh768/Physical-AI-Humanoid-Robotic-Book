# Data Model: Docusaurus Navbar Auth (Better Auth)

## Authentication State Entity

**Name**: Authentication State
**Description**: Represents the user's authentication status in the context of navbar rendering
**Fields**:
- `isAuthenticated` (boolean): Indicates if user is currently authenticated
- `user` (object, optional): User profile information when authenticated
  - `id` (string): Unique user identifier
  - `email` (string): User's email address
  - `name` (string, optional): User's display name
- `isLoading` (boolean): Indicates if auth state is being determined

**Relationships**:
- Related to Better Auth session state
- Drives conditional rendering of navbar elements

**Validation Rules**:
- When `isAuthenticated` is true, `user` object must be present
- When `isAuthenticated` is false, `user` object must be null/undefined
- `isLoading` is true during initial auth state determination

## Navbar Item Entity

**Name**: Auth-aware Navbar Item
**Description**: A Docusaurus navbar component that renders different content based on authentication state
**Fields**:
- `type` (string): Component type identifier (e.g., "auth-navbar-item")
- `position` (string): Position in navbar (left, right)
- `authStates` (object): Configuration for different auth states
  - `authenticated` (object): Content to render when authenticated
    - `label` (string): Button label (e.g., "Logout")
    - `action` (function): Function to execute on click
  - `unauthenticated` (object): Content to render when not authenticated
    - `signInLabel` (string): Sign in button label
    - `signUpLabel` (string): Sign up button label
    - `signInAction` (function): Sign in flow trigger
    - `signUpAction` (function): Sign up flow trigger

**Relationships**:
- Depends on Authentication State entity for rendering decisions
- Uses Better Auth client methods for authentication flows

## State Transitions

### Authentication State Transitions
1. **Loading → Authenticated**: When auth session is confirmed valid
2. **Loading → Unauthenticated**: When no valid auth session exists
3. **Authenticated → Unauthenticated**: When user logs out
4. **Unauthenticated → Authenticated**: When user successfully logs in

### Navbar Item Rendering Transitions
1. **Loading State**: Shows placeholder/spinner
2. **Unauthenticated State**: Shows Sign In and Sign Up buttons
3. **Authenticated State**: Shows Logout button (and potentially user info)

## Component Props Interface

```typescript
interface AuthNavbarItemProps {
  // Docusaurus navbar item props
  className?: string;
  mobile?: boolean;

  // Auth-specific props
  signInLabel?: string;    // Default: "Sign In"
  signUpLabel?: string;    // Default: "Sign Up"
  logoutLabel?: string;    // Default: "Logout"
  onSignIn?: () => void;   // Custom sign in handler
  onSignUp?: () => void;   // Custom sign up handler
  onLogout?: () => void;   // Custom logout handler
}
```

## Event Flow Model

### Authentication Events
1. **Auth State Change**: Better Auth client detects session change
2. **Component Re-render**: AuthNavbarItem receives updated auth state
3. **UI Update**: Navbar buttons update to reflect new auth state

### User Interaction Events
1. **Sign In Click**: Triggers Better Auth sign in flow
2. **Sign Up Click**: Triggers Better Auth sign up flow
3. **Logout Click**: Triggers Better Auth sign out flow
4. **Auth State Update**: Component updates to reflect new state