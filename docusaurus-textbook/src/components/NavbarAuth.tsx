import React, { useState, useEffect } from 'react';
import styles from '../theme/NavbarItemCustomNavbarAuth.module.css';

// Define the props type for the NavbarAuth component
interface NavbarAuthProps {
  // Add any additional props here if needed
}

const NavbarAuth: React.FC<NavbarAuthProps> = () => {
  // State to track authentication status
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');

  // Check authentication status on component mount
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const storedUserName = localStorage.getItem('userName');

    if (authToken && storedUserName) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
    }
  }, []);

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    window.location.reload();
  };

  // Render based on authentication status
  if (isLoggedIn) {
    return (
      <div className={styles.navbarAuthContainer}>
        {/* User info with simple avatar */}
        <div className={styles.userSummary}>
          <a href="/dashboard" className={styles.userLink}>
            <div className={styles.userAvatar}>
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className={styles.userName}>
              {userName}
            </span>
          </a>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
    );
  }

  // Render login/signup buttons for unauthenticated users
  return (
    <div className={styles.navbarAuthButtons}>
      <a
        href="/login"
        className={`${styles.signInButton} button button--secondary button--sm`}
      >
        Login
      </a>
      <a
        href="/signup"
        className={`${styles.signUpButton} button button--primary button--sm`}
      >
        Sign Up
      </a>
    </div>
  );
};

export default NavbarAuth;
