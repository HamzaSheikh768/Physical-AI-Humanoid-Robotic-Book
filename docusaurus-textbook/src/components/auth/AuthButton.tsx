import React from 'react';
import { motion } from 'framer-motion';
import { buttonVariants } from '../../animations/variants';

interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
  icon,
  fullWidth = false
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'button--primary';
      case 'secondary':
        return 'button--secondary';
      case 'outline':
        return 'button--outline button--secondary';
      case 'ghost':
        return 'button--link';
      default:
        return 'button--primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'button--sm';
      case 'lg':
        return 'button--lg';
      default:
        return 'button--md';
    }
  };

  const baseClasses = [
    'button',
    getVariantClass(),
    getSizeClass(),
    fullWidth ? 'button--block' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
      variants={buttonVariants}
      whileHover={!disabled && !loading ? "whileHover" : undefined}
      whileTap={!disabled && !loading ? "whileTap" : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: icon ? '0.5rem' : undefined
      }}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="margin-right--sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              opacity="0.3"
            />
            <path
              d="M12 2C17.5228 2 22 6.47715 22 12H20C20 7.58172 16.4183 4 12 4V2Z"
              fill="currentColor"
            />
          </svg>
        </motion.span>
      ) : icon ? (
        <span className="margin-right--sm">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default AuthButton;