import { Variants } from 'framer-motion';

// Default spring transitions
export const defaultSpring = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 1
};

export const gentleSpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
  mass: 1
};

export const snappySpring = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
  mass: 1
};

// Animation presets
export const animationPresets = {
  entrance: {
    duration: 0.6,
    ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number]
  },
  exit: {
    duration: 0.3,
    ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number]
  },
  hover: {
    duration: 0.2,
    ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number]
  },
  tap: {
    duration: 0.1,
    ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number]
  }
};

// Page variants
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Stagger container variants
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Stagger child variants
export const staggerChild: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Button variants
export const buttonVariants: Variants = {
  initial: { scale: 1 },
  whileHover: {
    scale: 1.03,
    transition: { ...defaultSpring, ...animationPresets.hover }
  },
  whileTap: {
    scale: 0.98,
    transition: { ...defaultSpring, ...animationPresets.tap }
  },
  disabled: {
    opacity: 0.6,
    scale: 1
  }
};

// Card variants
export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ...defaultSpring, ...animationPresets.entrance }
  },
  whileHover: {
    y: -5,
    transition: { ...gentleSpring, ...animationPresets.hover }
  }
};

// Form field variants
export const fieldVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { ...defaultSpring, ...animationPresets.entrance }
  },
  focus: {
    scale: 1.02,
    transition: { ...gentleSpring }
  },
  error: {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.3 }
  }
};

// Loading spinner variants
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear"
    }
  }
};
