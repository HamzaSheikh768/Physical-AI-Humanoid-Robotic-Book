import React from 'react';
import { motion } from 'framer-motion';
import { cardVariants } from '../../animations/variants';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  className = '',
  variant = 'default'
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'card--primary';
      case 'secondary':
        return 'card--secondary';
      default:
        return '';
    }
  };

  const baseClasses = [
    'card',
    getVariantClass(),
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={baseClasses}
      variants={cardVariants}
      whileHover="whileHover"
      layout
    >
      <div className="card__header text--center padding--md">
        {icon && <div className="margin-bottom--sm">{icon}</div>}
        <h3 className="text--normal">{title}</h3>
        {subtitle && <p className="text--small text--gray margin-top--sm">{subtitle}</p>}
      </div>
      <div className="card__body padding--lg">
        {children}
      </div>
    </motion.div>
  );
};

export default DashboardCard;