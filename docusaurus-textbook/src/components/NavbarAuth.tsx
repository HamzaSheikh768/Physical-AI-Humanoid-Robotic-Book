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
        <div className="flex items-center">
          <a href="/dashboard" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium group-hover:bg-blue-600 transition-colors">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
              {userName}
            </span>
          </a>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
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