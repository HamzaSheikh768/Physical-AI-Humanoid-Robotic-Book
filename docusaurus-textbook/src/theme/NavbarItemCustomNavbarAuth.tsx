import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useAuth } from '../contexts/AuthContext';
import styles from './NavbarItemCustomNavbarAuth.module.css';

const NavbarItemCustomNavbarAuth = () => {
  const { siteConfig } = useDocusaurusContext();

  // Try to get auth state with error handling
  let authState;
  try {
    authState = useAuth();
  } catch (err) {
    // If the hook is used outside of AuthProvider, return basic buttons
    return (
      <div className={`${styles.navbarAuthButtons} navbar__item navbar__auth-buttons`}>
        <Link
          className={`button button--secondary button--sm ${styles.signInButton}`}
          to="/auth/signin"
          aria-label="Sign in to your account"
        >
          Sign In
        </Link>
        <Link
          className={`button button--primary button--sm ${styles.signUpButton}`}
          to="/auth/signup"
          aria-label="Create a new account"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  const { user, isLoading, error } = authState;

  // If there's an error, show error state
  if (error) {
    return (
      <div className={styles.navbarAuthError}>
        <span className={styles.errorText}>Authentication error</span>
      </div>
    );
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className={styles.navbarAuthLoading}>
        Loading...
      </div>
    );
  }

  // If user is authenticated, show user profile or logout
  if (user) {
    return (
      <div className={`${styles.navbarAuthContainer} navbar__item navbar__user-menu`}>
        <Link className="button button--secondary button--sm" to="/dashboard">
          Dashboard
        </Link>
        <Link className="button button--outline button--secondary button--sm margin-left--sm" to="/auth/logout">
          Sign Out
        </Link>
      </div>
    );
  }

  // If user is not authenticated, show Sign In and Sign Up buttons
  return (
    <div
      className={`${styles.navbarAuthButtons} navbar__item navbar__auth-buttons`}
      role="navigation"
      aria-label="Authentication options"
    >
      <Link
        className={`button button--secondary button--sm ${styles.signInButton}`}
        to="/login"
        aria-label="Sign in to your account"
      >
        Login
      </Link>
      <Link
        className={`button button--primary button--sm ${styles.signUpButton}`}
        to="/signup"
        aria-label="Create a new account"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default NavbarItemCustomNavbarAuth;