import React, { useState, useEffect } from 'react';
import { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface AuthNavbarItemProps {
  position?: 'left' | 'right';
  className?: string;
}

const AuthNavbarItem: React.FC<AuthNavbarItemProps> = ({
  position = 'right',
  className = ''
}) => {
  // Use the session context instead of Better Auth client
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { siteConfig } = useDocusaurusContext();
  const API_BASE_URL = siteConfig.customFields?.CHAT_API_URL as string || 'http://localhost:8000';

  // Check session on component mount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const checkSession = async () => {
      try {
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

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setSession({
            id: 'mock-session-id',
            userId: userData.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
      } catch (err) {
        console.error('Error checking session:', err);
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

    checkSession();
  }, [API_BASE_URL]);

  // Note: We don't have isError in this implementation since we're not using Better Auth

  // Loading state - show nothing or a placeholder while determining auth state
  if (loading) {
    return (
      <div className={className}>
        <span
          className="navbar__link"
          aria-label={translate({ id: 'theme.navbar.authLoading', message: 'Loading authentication status...' })}
        >
          {translate({ id: 'theme.navbar.loading', message: '...' })}
        </span>
      </div>
    );
  }

  // Error state - show error message
  if (error) {
    return (
      <div className={className}>
        <span
          className="navbar__link navbar__link--error"
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      </div>
    );
  }

  if (authenticated && user) {
    // Authenticated state - show logout button
    return (
      <div className={className}>
        <button
          onClick={async () => {
            try {
              // Clear the stored access token (this is the "logout" for JWT)
              if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
              }

              // Update state to reflect logout
              setUser(null);
              setSession(null);
              setAuthenticated(false);

              // Optional: redirect to home or login page
              // window.location.href = '/auth/signin';
            } catch (err) {
              setError(translate({ id: 'theme.navbar.logoutError', message: 'Error logging out. Please try again.' }));
            }
          }}
          className="navbar__link"
          aria-label={translate({ id: 'theme.navbar.logoutAriaLabel', message: 'Logout from your account' })}
        >
          {translate({ id: 'theme.navbar.logout', message: 'Logout' })}
        </button>
      </div>
    );
  } else {
    // Unauthenticated state - show sign in/up buttons
    return (
      <div className={className}>
        <div className="navbar__auth-buttons" role="group" aria-label={translate({ id: 'theme.navbar.authButtonsGroup', message: 'Authentication options' })}>
          <button
            onClick={() => {
              // Redirect to sign-in page
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/signin';
              }
            }}
            className="navbar__link"
            style={{ marginRight: '1rem' }}
            aria-label={translate({ id: 'theme.navbar.signinAriaLabel', message: 'Sign in to your account' })}
          >
            {translate({ id: 'theme.navbar.signin', message: 'Sign In' })}
          </button>
          <button
            onClick={() => {
              // Redirect to sign-up page
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/signup';
              }
            }}
            className="navbar__link button button--primary"
            aria-label={translate({ id: 'theme.navbar.signupAriaLabel', message: 'Create a new account' })}
          >
            {translate({ id: 'theme.navbar.signup', message: 'Sign Up' })}
          </button>
        </div>
      </div>
    );
  }
};

export default AuthNavbarItem;