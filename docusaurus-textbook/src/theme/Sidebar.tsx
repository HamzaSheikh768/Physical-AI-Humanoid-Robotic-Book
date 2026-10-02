import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { ThemeClassNames } from '@docusaurus/theme-common';
import styles from './Sidebar.module.css';

interface SidebarProps {
  sidebar?: unknown;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const { pathname } = useLocation();

  // Toggle sidebar visibility on mobile
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Close sidebar when route changes
  useEffect(() => {
    setIsSidebarVisible(false);
  }, [pathname]);

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        className,
        styles.sidebar,
        {
          [styles.sidebarHidden]: !isSidebarVisible,
          [styles.sidebarVisible]: isSidebarVisible,
        },
      )}
      onTransitionEnd={(e) => {
        if (e.propertyName === 'width' && !isSidebarVisible) {
          e.stopPropagation();
        }
      }}
    >
      <div className={styles.sidebarLogo}>
        <button
          className={styles.sidebarToggle}
          onClick={toggleSidebar}
          aria-label={isSidebarVisible ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isSidebarVisible ? '✕' : '☰'}
        </button>
      </div>

      <nav
        className={clsx(styles.sidebarMenu, {
          [styles.sidebarMenuVisible]: isSidebarVisible,
        })}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        <ul className={styles.sidebarList}>
          <li className={styles.sidebarItem}>
            <Link
              to="/"
              className={clsx(styles.sidebarItemLink, {
                [styles.sidebarItemLinkActive]: pathname === '/',
              })}
              onClick={() => setIsSidebarVisible(false)}
            >
              Home
            </Link>
          </li>
          <li className={styles.sidebarItem}>
            <Link
              to="/docs/Introduction"
              className={clsx(styles.sidebarItemLink, {
                [styles.sidebarItemLinkActive]: pathname.includes('/docs/Introduction'),
              })}
              onClick={() => setIsSidebarVisible(false)}
            >
              Introduction
            </Link>
          </li>
          <li className={styles.sidebarItem}>
            <Link
              to="/docs/Overview-Module-and-Chapter"
              className={clsx(styles.sidebarItemLink, {
                [styles.sidebarItemLinkActive]: pathname.includes('/docs/Overview-Module-and-Chapter'),
              })}
              onClick={() => setIsSidebarVisible(false)}
            >
              Modules Overview
            </Link>
          </li>
          <li className={styles.sidebarItem}>
            <Link
              to="/docs/Setup-Guide"
              className={clsx(styles.sidebarItemLink, {
                [styles.sidebarItemLinkActive]: pathname.includes('/docs/Setup-Guide'),
              })}
              onClick={() => setIsSidebarVisible(false)}
            >
              Setup Guide
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
