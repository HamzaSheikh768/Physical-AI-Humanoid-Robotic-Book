import React, { useState, useEffect } from 'react';
import styles from '../css/Sidebar.module.css';

interface SidebarItem {
  title: string;
  href: string;
  isActive: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  items = [],
  isCollapsed = false,
  onToggle
}) => {
  const [isOpen, setIsOpen] = useState(!isCollapsed);
  const [activeItem, setActiveItem] = useState(items.find(item => item.isActive)?.title || '');
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle();
  };

  // Check if we're on mobile and update accordingly
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.collapsed}`}>
      <button
        className={styles.toggleButton}
        onClick={toggleSidebar}
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? "«" : "»"}
      </button>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {items.map((item, index) => (
            <li key={index} className={styles.navItem}>
              <a
                href={item.href}
                className={`${styles.navLink} ${item.isActive ? styles.active : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveItem(item.title);
                  window.location.href = item.href;
                }}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;