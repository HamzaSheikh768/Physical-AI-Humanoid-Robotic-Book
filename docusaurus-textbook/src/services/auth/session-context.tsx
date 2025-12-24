import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  // Custom metadata fields
  softwareBackground?: string;
  hardwareExperience?: string;
  learningTrack?: string;
  skillLevel?: string;
}

interface AuthSession {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

interface SessionContextType {
  user: User | null;
  session: AuthSession | null;
  authenticated: boolean;
  loading: boolean;
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.CHAT_API_URL as string || 'http://localhost:8000';

  const checkSession = async () => {
    try {
      // Only run on client side
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('access_token');
      if (!token) {
        // No token, user is not authenticated
        setUser(null);
        setSession(null);
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();

      if (response.ok) {
        // The backend returns user data directly when authenticated
        setUser(data);
        // Create a mock session since the backend doesn't return it in the same format
        setSession({
          id: 'mock-session-id',
          userId: data.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          createdAt: new Date().toISOString()
        });
        setAuthenticated(true);
      } else {
        // Token exists but is invalid/expired
        localStorage.removeItem('access_token');
        setUser(null);
        setSession(null);
        setAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // Clear any potentially invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      setUser(null);
      setSession(null);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear the stored access token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }

      // Reset state
      setUser(null);
      setSession(null);
      setAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    setMounted(true); // Mark as mounted on client side

    // Only run on client side
    if (typeof window !== 'undefined') {
      // Check session status on component mount
      checkSession();

      // Add event listener to check session on page visibility change
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          checkSession();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    } else {
      // On server, set loading to false to avoid hydration issues
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Don't render children until mounted to avoid build-time issues
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <SessionContext.Provider
      value={{
        user,
        session,
        authenticated,
        loading,
        checkSession,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
