# Data Model: UI Redesign & Animation Implementation — Framer Motion Best Practices Addendum

**Branch**: `010-ui-system-upgrade` | **Date**: 2025-12-28 | **Spec**: [specs/010-ui-system-upgrade/spec.md](specs/010-ui-system-upgrade/spec.md)

## Overview

This document defines the data models and component interfaces for the UI redesign with Framer Motion animations. It includes TypeScript interfaces for authentication state, form data, animation variants, and UI component props that will be used throughout the Sign Up, Login, Dashboard pages and Auth Buttons.

## Authentication Data Models

### User Authentication State
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Form Data Models
```typescript
interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AuthFormState {
  values: LoginFormValues | SignupFormValues;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitSuccess: boolean;
}
```

## Animation Data Models

### Framer Motion Variants
```typescript
interface AnimationVariants {
  initial: object | string;
  animate: object | string;
  exit?: object | string;
  whileHover?: object;
  whileTap?: object;
  transition?: object;
}

interface PageVariants {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  exit: { opacity: number; y: number };
}

interface StaggerContainerVariants {
  animate: {
    transition: {
      staggerChildren: number;
    };
  };
}

interface StaggerChildVariants {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number; transition: { duration: number } };
}

interface ButtonVariants {
  initial: object;
  whileHover: { scale: number; transition: object };
  whileTap: { scale: number; transition: object };
  disabled: { opacity: number; scale: number };
}

interface CardVariants {
  initial: { opacity: number; scale: number };
  animate: { opacity: number; scale: number };
  whileHover: { y: number; transition: object };
}
```

## Component Data Models

### Auth Button Props
```typescript
interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

interface AuthButtonsProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  showIcons?: boolean;
  className?: string;
}
```

### Form Field Props
```typescript
interface FormFieldProps {
  label: string;
  id: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

interface FormContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}
```

### Dashboard Data Models
```typescript
interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

interface UserDashboardData {
  user: User;
  stats: {
    totalChapters: number;
    completedChapters: number;
    timeSpent: string;
    progressPercentage: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    timestamp: string;
    type: 'chapter' | 'translation' | 'quiz' | 'discussion';
  }>;
}
```

## Animation Configuration

### Default Spring Transitions
```typescript
interface SpringTransition {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass?: number;
}

const defaultSpring: SpringTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1
};

const gentleSpring: SpringTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
  mass: 1
};

const snappySpring: SpringTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1
};
```

### Animation Presets
```typescript
interface AnimationPreset {
  duration: number;
  ease: string[];
}

const animationPresets = {
  entrance: {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1.0]
  },
  exit: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1.0]
  },
  hover: {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1.0]
  },
  tap: {
    duration: 0.1,
    ease: [0.25, 0.1, 0.25, 1.0]
  }
};
```

## Theme Configuration

### Color System
```typescript
interface ColorPalette {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  background: {
    default: string;
    card: string;
    modal: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
}
```

### Spacing System
```typescript
interface SpacingSystem {
  xs: number; // 8px
  sm: number; // 16px
  md: number; // 24px
  lg: number; // 32px
  xl: number; // 40px
  '2xl': number; // 48px
  '3xl': number; // 56px
  '4xl': number; // 64px
}
```

### Typography System
```typescript
interface TypographySystem {
  fontFamily: string; // 'Inter'
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  weights: {
    thin: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeights: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}
```

## Component State Management

### Loading States
```typescript
type LoadingState = 'idle' | 'loading' | 'success' | 'error';

interface LoadingStateWithMessage {
  state: LoadingState;
  message?: string;
  progress?: number;
}
```

### Form Validation
```typescript
interface ValidationRule {
  rule: (value: any) => boolean;
  message: string;
}

interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}
```

This data model provides the foundation for the UI redesign with Framer Motion animations, ensuring type safety and consistency across all components while maintaining accessibility and performance standards.