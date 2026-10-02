# Auth API Contract: Authentication & Onboarding UX Redesign

## Overview
This document defines the API contracts for the authentication and onboarding system. Since the implementation uses Better Auth with Docusaurus, these contracts represent the expected behavior and interfaces.

## Authentication Endpoints

### User Registration
- **Endpoint**: `/api/auth/register` (or Better Auth equivalent)
- **Method**: POST
- **Request**:
  - email: string (required, valid email format)
  - password: string (required, minimum 8 characters)
  - softwareBackground: string (optional)
  - hardwareExperience: string (optional)
  - learningTrack: string (optional, enum: SOFTWARE_ONLY, HARDWARE_ONLY, FULL_ROBOTICS)
  - skillLevel: string (optional, enum: BEGINNER, INTERMEDIATE, ADVANCED)

- **Response**:
  - Success: 201 Created with session token
  - Duplicate email: 409 Conflict with error message
  - Validation error: 400 Bad Request with field-specific errors
  - Server error: 500 Internal Server Error

### User Login
- **Endpoint**: `/api/auth/login` (or Better Auth equivalent)
- **Method**: POST
- **Request**:
  - email: string (required)
  - password: string (required)

- **Response**:
  - Success: 200 OK with session token
  - Invalid credentials: 401 Unauthorized with error message
  - Server error: 500 Internal Server Error

### Session Validation
- **Endpoint**: `/api/auth/session` (or Better Auth equivalent)
- **Method**: GET
- **Request**: Requires valid session token
- **Response**:
  - Success: 200 OK with user profile data
  - Unauthorized: 401 Unauthorized

### User Profile Update
- **Endpoint**: `/api/auth/profile` (or Better Auth equivalent)
- **Method**: PUT/PATCH
- **Request**:
  - Requires valid session token
  - Profile fields to update (softwareBackground, hardwareExperience, learningTrack, skillLevel)

- **Response**:
  - Success: 200 OK with updated profile
  - Validation error: 400 Bad Request
  - Unauthorized: 401 Unauthorized

## Component Interfaces

### LoginForm Props
- **Interface**: LoginFormProps
- **Fields**:
  - onSuccess: () => void (callback on successful login)
  - onError: (error: string) => void (callback on error)
  - loading: boolean (loading state)
  - setLoading: (loading: boolean) => void (loading state setter)

### SignupForm Props
- **Interface**: SignupFormProps
- **Fields**:
  - onSuccess: () => void (callback on successful signup)
  - onError: (error: string) => void (callback on error)
  - loading: boolean (loading state)
  - setLoading: (loading: boolean) => void (loading state setter)

### AuthButton Props
- **Interface**: AuthButtonProps
- **Fields**:
  - variant: 'primary' | 'secondary' (button style)
  - loading: boolean (loading state)
  - children: React.ReactNode (button content)
  - onClick: () => void (click handler)

## Error Handling Contract

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      // Optional field-specific details
    }
  }
}
```

### Common Error Codes
- `DUPLICATE_EMAIL`: Email already exists
- `INVALID_CREDENTIALS`: Login credentials are incorrect
- `VALIDATION_ERROR`: Input validation failed
- `SERVER_ERROR`: Internal server error
- `RATE_LIMITED`: Too many requests

## Animation Contract

### Animation Properties
- Page transitions: opacity (0→1), y-translation (16px → 0)
- Input focus: border color change, subtle scale (1.01)
- Button hover: translateY (-2px), box shadow addition
- Error messages: fade in with slight scale effect
- Loading states: spinner animation with opacity change

## Validation Contract

### Client-Side Validation
- Email format validation using standard regex
- Password minimum length (8 characters)
- Required field validation
- Duplicate email check (async validation)

### Server-Side Validation
- Email uniqueness check
- Password strength requirements
- Rate limiting for authentication attempts
- Input sanitization

## Session Management Contract

### Cookie Configuration
- Secure: true (HTTPS only)
- HttpOnly: true (not accessible via JavaScript)
- SameSite: 'strict' (CSRF protection)
- Max-Age: Appropriate session duration

### Token Expiration
- Short-lived access tokens
- Refresh token mechanism (if applicable)
- Automatic session renewal
- Proper logout handling

## Performance Contract

### Response Time Requirements
- Login: < 1 second (p95)
- Registration: < 1.5 seconds (p95)
- Session validation: < 0.5 seconds (p95)
- Profile update: < 1 second (p95)

### Animation Performance
- All animations: 60fps
- Page transitions: < 300ms
- Button interactions: < 100ms response
- Loading states: Immediate feedback