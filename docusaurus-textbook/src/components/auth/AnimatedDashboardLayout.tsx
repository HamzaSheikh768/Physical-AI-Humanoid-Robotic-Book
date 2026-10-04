import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer } from '../../animations/variants';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

const AnimatedDashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
  header,
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <motion.div
      className={`container margin-vert--lg ${className}`}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {/* Mobile menu button */}
      {sidebar && (
        <div className="margin-bottom--md docusaurus-mt--xl" style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <button
            className="button button--secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? 'Close Menu' : 'Open Menu'}
          </button>
        </div>
      )}

      <div className="row">
        {/* Desktop sidebar */}
        <div className={`col ${sidebar ? (sidebarOpen ? 'col--3' : 'd-none docusaurus-display-none') : 'col--12'}`}>
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="d-lg-none"
              >
                {sidebar}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="d-none d-lg-block">
            {sidebar}
          </div>
        </div>

        {/* Main content */}
        <div className={sidebar ? "col col--9" : "col col--12"}>
          {header && <div className="margin-bottom--lg">{header}</div>}
          <motion.div variants={staggerContainer}>
            {children}
          </motion.div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="docusaurus-overlay d-lg-none"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 100
              }}
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedDashboardLayout;