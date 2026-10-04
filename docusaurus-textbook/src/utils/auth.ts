/**
 * Authentication utilities for the Urdu translation feature
 * Provides functions to check if user is authenticated for translation access
 */

/**
 * Check if user is authenticated
 * This function verifies if the user is logged in by checking for auth tokens in localStorage
 * @returns boolean indicating if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    // Server-side, no localStorage available
    return false;
  }

  // Check for authentication tokens in localStorage
  // This assumes Better Auth stores tokens in localStorage with a specific pattern
  const authTokens = Object.keys(localStorage).filter(key =>
    key.startsWith('better-auth') || key.includes('auth') || key.includes('token')
  );

  // If we have auth tokens, consider user authenticated
  if (authTokens.length > 0) {
    // Additional check: verify token hasn't expired
    for (const tokenKey of authTokens) {
      try {
        const tokenData = localStorage.getItem(tokenKey);
        if (tokenData) {
          // For Better Auth, tokens might be stored as JSON objects
          const parsed = JSON.parse(tokenData);

          // Check if token has expiration
          if (parsed.expiresAt) {
            const expiresAt = new Date(parsed.expiresAt);
            if (expiresAt > new Date()) {
              return true; // Token is valid and not expired
            }
          } else if (parsed.exp) {
            // JWT-style expiration (timestamp)
            if (parsed.exp * 1000 > Date.now()) {
              return true; // Token is valid and not expired
            }
          } else {
            // If no expiration, assume it's valid (session-based)
            return true;
          }
        }
      } catch (error) {
        // If parsing fails, continue checking other tokens
        continue;
      }
    }
  }

  // Alternative: check for user session data
  const userSession = localStorage.getItem('better-auth.session');
  if (userSession) {
    try {
      const session = JSON.parse(userSession);
      if (session.expiresAt) {
        const expiresAt = new Date(session.expiresAt);
        return expiresAt > new Date();
      }
      return true; // If no expiration, assume valid
    } catch (error) {
      // If parsing fails, continue
    }
  }

  return false;
}

/**
 * Get user ID if authenticated
 * @returns User ID string if authenticated, null otherwise
 */
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!isAuthenticated()) {
    return null;
  }

  // Try to get user ID from auth storage
  const userSession = localStorage.getItem('better-auth.session');
  if (userSession) {
    try {
      const session = JSON.parse(userSession);
      return session.userId || session.user?.id || null;
    } catch (error) {
      // If parsing fails, continue
    }
  }

  // Check for user data in other possible locations
  const userData = localStorage.getItem('better-auth.user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.id || null;
    } catch (error) {
      // If parsing fails, continue
    }
  }

  return null;
}

/**
 * Get auth headers for API requests
 * @returns Object with authentication headers
 */
export function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    // If using Better Auth, we might need to include auth cookies or tokens
    // For now, we'll rely on the fact that fetch requests will include cookies automatically
    // if the API and frontend are on the same domain
  }

  return headers;
}

/**
 * Check if user has permission for specific translation
 * @param chapterId The chapter ID the user wants to translate
 * @returns boolean indicating if user has permission
 */
export function hasTranslationPermission(chapterId: string): boolean {
  // For now, any authenticated user can translate any chapter
  // This could be extended to check user roles, chapter access permissions, etc.
  return isAuthenticated();
}

/**
 * Redirect to login page if not authenticated
 * @param returnUrl Optional URL to return to after login
 */
export function requireAuth(returnUrl?: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!isAuthenticated()) {
    const redirectUrl = returnUrl ?
      `/auth/signin?return=${encodeURIComponent(returnUrl)}` :
      '/auth/signin';

    window.location.href = redirectUrl;
  }
}

/**
 * Hook for use in React components to check authentication
 * This is a simplified version - in a real app, you'd want to use the actual useAuth hook
 */
export function useAuthCheck(): {
  isAuthenticated: boolean;
  userId: string | null;
  loading: boolean
} {
  // In a real implementation, this would be a proper React hook
  // For now, we'll return the current state
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, userId: null, loading: false };
  }

  // In a real app, this would use the actual AuthContext
  // For this utility file, we'll just return the current state
  const userId = getCurrentUserId();

  return {
    isAuthenticated: isAuthenticated(),
    userId,
    loading: false // We're not actually loading anything in this simplified version
  };
}