import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {ThemeClassNames} from '@docusaurus/theme-common';
import styles from './Sidebar.module.css';

interface SidebarProps {
  sidebar?: unknown;
  className?: string;
}

const navItems = [
  {label: 'Home', to: '/'},
  {label: 'Introduction', to: '/docs/Introduction'},
  {label: 'Modules overview', to: '/docs/Overview-Module-and-Chapter'},
  {label: 'Setup guide', to: '/docs/Setup-Guide'},
];

const Sidebar: React.FC<SidebarProps> = ({className}) => {
  const {pathname} = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    () => typeof window === 'undefined' || window.innerWidth >= 997,
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 997;
      setIsMobile(mobile);
      setIsSidebarVisible((visible) => (mobile ? visible : true));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  }, [pathname, isMobile]);

  return (
    <>
      {isMobile && !isSidebarVisible && (
        <button
          type="button"
          className={styles.mobileToggle}
          onClick={() => setIsSidebarVisible(true)}
          aria-label="Open navigation menu"
          aria-expanded={false}
        >
          Menu
        </button>
      )}
      <aside
        className={clsx(
          ThemeClassNames.docs.docSidebarContainer,
          className,
          styles.sidebar,
          {[styles.sidebarHidden]: isMobile && !isSidebarVisible},
          {[styles.sidebarVisible]: !isMobile || isSidebarVisible},
        )}
        aria-label="Documentation navigation"
      >
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLabel}>On this path</span>
          {isMobile && (
            <button
              type="button"
              className={styles.sidebarToggle}
              onClick={() => setIsSidebarVisible(false)}
              aria-label="Close navigation menu"
              aria-expanded={true}
            >
              Close
            </button>
          )}
        </div>
        <nav className={styles.sidebarMenu} aria-label="Sidebar navigation">
          <ul className={styles.sidebarList}>
            {navItems.map((item) => {
              const isActive = item.to === '/'
                ? pathname === '/'
                : pathname.includes(item.to);

              return (
                <li className={styles.sidebarItem} key={item.to}>
                  <Link
                    to={item.to}
                    className={clsx(styles.sidebarItemLink, {
                      [styles.sidebarItemLinkActive]: isActive,
                    })}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => isMobile && setIsSidebarVisible(false)}
                  >
                    <span>{item.label}</span>
                    <span className={styles.sidebarArrow} aria-hidden="true">↗</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      {isMobile && isSidebarVisible && (
        <button
          type="button"
          className={styles.sidebarBackdrop}
          onClick={() => setIsSidebarVisible(false)}
          aria-label="Close navigation menu"
        />
      )}
    </>
  );
};

export default Sidebar;
