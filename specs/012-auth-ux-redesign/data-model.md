# Data Model: Authentication & Onboarding UX Redesign

## User Account Entity
- **Entity Name**: User Account
- **Fields**:
  - id: string (unique identifier)
  - email: string (required, unique, valid email format)
  - password: string (hashed, required, minimum 8 characters)
  - createdAt: datetime (timestamp of account creation)
  - updatedAt: datetime (timestamp of last update)
  - isActive: boolean (account status)
  - emailVerified: boolean (email verification status)

## User Profile Entity
- **Entity Name**: User Profile
- **Fields**:
  - userId: string (foreign key to User Account)
  - softwareBackground: string (optional, text field for software experience)
  - hardwareExperience: string (optional, text field for hardware/robotics experience)
  - learningTrack: string (enum: "SOFTWARE_ONLY" | "HARDWARE_ONLY" | "FULL_ROBOTICS", default: "SOFTWARE_ONLY")
  - skillLevel: string (enum: "BEGINNER" | "INTERMEDIATE" | "ADVANCED", default: "BEGINNER")
  - profileCompleted: boolean (whether onboarding is complete)
  - preferences: object (user preferences for content personalization)

## Authentication Session Entity
- **Entity Name**: Authentication Session
- **Fields**:
  - sessionId: string (unique session identifier)
  - userId: string (foreign key to User Account)
  - token: string (session token)
  - expiresAt: datetime (session expiration timestamp)
  - createdAt: datetime (session creation timestamp)
  - userAgent: string (user agent string for security)
  - ipAddress: string (IP address for security)

## Validation Rules
- **User Account**:
  - Email must be unique across all accounts
  - Email must match standard email format
  - Password must be at least 8 characters
  - Email verification required before full access

- **User Profile**:
  - Software background optional, max 500 characters
  - Hardware experience optional, max 500 characters
  - Learning track must be one of the defined enum values
  - Skill level must be one of the defined enum values

## State Transitions
- **Account Creation Flow**:
  - Anonymous → Account Created (email + password) → Profile Collection → Account Active

- **Authentication Flow**:
  - Unauthenticated → Credentials Validated → Session Created → Authenticated

- **Profile Completion**:
  - Profile Incomplete → Onboarding Started → Profile Complete → Personalized Experience

## Relationships
- One User Account to One User Profile (1:1)
- One User Account to Many Authentication Sessions (1:M)
- User Profile contains personalization data that affects content visibility and sequencing

## Data Flow
- User enters credentials → Authentication validated → Session created → Profile checked → Dashboard/Onboarding routing
- New user signup → Account created → Profile collection → Profile saved → Session created → Dashboard routing
- Duplicate email detection → Error message shown → Login prompt