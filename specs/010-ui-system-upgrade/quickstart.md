# Quickstart: UI Redesign & Animation Implementation — Framer Motion Best Practices Addendum

## Getting Started

This guide will help you quickly set up and start using the UI redesign with Framer Motion animations in your Docusaurus project.

## Prerequisites

- Node.js 18+
- npm or yarn
- Docusaurus CLI installed globally
- Framer Motion already installed (version 12.23.26)

## Installation

1. Clone or navigate to your Docusaurus project
2. Ensure the project structure matches the expected format with `src/` directory
3. Install dependencies:
```bash
npm install
```

## Animation Components Usage

### Global MotionConfig
The global MotionConfig is automatically applied via the Layout wrapper in `src/theme/Layout.tsx` and handles reduced motion preferences:

```typescript
// Already configured in src/theme/Layout.tsx
<MotionConfig reducedMotion="user">
  <AuthProvider>
    <OriginalLayout {...props}>
      {props.children}
      <ChatWidget />
    </OriginalLayout>
  </AuthProvider>
</MotionConfig>
```

### Variants System
The centralized variants system is located in `src/animations/variants.ts` and provides reusable animation definitions:

```typescript
import { staggerContainer, staggerChild, buttonVariants, cardVariants } from '../animations/variants';

// Use variants with Framer Motion components
<motion.div variants={staggerContainer} animate="animate">
  <motion.div variants={staggerChild}>Content</motion.div>
</motion.div>
```

### Animated Auth Components
Use the animated auth components for login and signup:

```typescript
import AnimatedLoginForm from '../components/auth/AnimatedLoginForm';
import AnimatedSignupForm from '../components/auth/AnimatedSignupForm';
import AuthButton from '../components/auth/AuthButton';

function AuthPage() {
  return (
    <div>
      <AnimatedLoginForm />
      <AuthButton variant="primary" onClick={() => console.log('Login')}>
        Sign In
      </AuthButton>
    </div>
  );
}
```

### Animated Dashboard Components
Use the animated dashboard components for user dashboards:

```typescript
import AnimatedDashboardLayout from '../components/auth/AnimatedDashboardLayout';
import DashboardCard from '../components/auth/DashboardCard';

function DashboardPage() {
  return (
    <AnimatedDashboardLayout>
      <DashboardCard title="Profile" subtitle="View your account information">
        <button>View Profile</button>
      </DashboardCard>
    </AnimatedDashboardLayout>
  );
}
```

## Styling

The components use CSS Modules and Docusaurus theme variables with the following global CSS variables:
- `--ifm-font-family-base`: Set to "Inter" font family
- `--ifm-spacing-xs` to `--ifm-spacing-4xl`: Spacing system (8/16/24px increments)
- `--ifm-radius-sm` to `--ifm-radius-xl`: Rounded corners (10-14px)
- `--ifm-color-emphasis-0`: True black background (#000000)

## Development

To start the development server:
```bash
npm run start
```

To build the project for production:
```bash
npm run build
```

To serve the production build locally:
```bash
npm run serve
```

## Performance Testing

To test performance and accessibility:

1. **Performance Audit:**
   - Use Chrome DevTools Performance tab to record 10-second interactions
   - Verify consistent 60fps during animations
   - Check for dropped frames during hover/transition states
   - Test on mobile device emulation

2. **Accessibility Testing:**
   - Use axe-core, WAVE, or Lighthouse for automated testing
   - Test with screen readers (VoiceOver, NVDA, JAWS)
   - Verify keyboard navigation works properly
   - Test with reduced motion enabled

## Troubleshooting

- If animations don't work, ensure MotionConfig is properly wrapped around the app
- If reduced motion isn't respected, verify MotionConfig reducedMotion="user" is set
- If focus rings don't appear, check focus-visible polyfill is working
- If bundle size is too large, consider implementing LazyMotion for non-critical animations