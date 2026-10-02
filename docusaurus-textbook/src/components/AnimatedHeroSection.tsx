import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../css/AnimatedHeroSection.module.css';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl?: string;
  imageAlt?: string;
}

const AnimatedHeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  primaryButtonText = "Get Started",
  primaryButtonLink = "/docs/Introduction",
  secondaryButtonText,
  secondaryButtonLink,
  imageUrl,
  imageAlt = "Hero section image"
}) => {
  const { siteConfig } = useDocusaurusContext();
  const [isPrimaryButtonHovered, setIsPrimaryButtonHovered] = useState(false);
  const [isSecondaryButtonHovered, setIsSecondaryButtonHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100
      }
    }
  };

  const buttonVariants = {
    rest: {
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      y: -3,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
      }
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        type: "spring" as const,
        stiffness: 80,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 10
      }
    }
  };

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <motion.div
          className={styles.heroGrid}
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div className={styles.textContent} variants={itemVariants}>
            <motion.h1 className={`hero__title ${styles.title}`} variants={itemVariants}>
              {title.toUpperCase().includes('PHYSICAL AI') ? (
                <>
                  <div className={styles.titleLine1}>
                    <span className={styles.titleBlue}>PHYSICAL AI</span>
                  </div>
                  <div className={styles.titleLine2}>
                    <span className={styles.titleText}>
                      {title.replace(/PHYSICAL AI &/i, '').trim()}
                    </span>
                  </div>
                </>
              ) : (
                <span className={styles.titleText}>{title}</span>
              )}
            </motion.h1>
            {subtitle && (
              <motion.p className={`hero__subtitle ${styles.subtitle}`} variants={itemVariants}>
                {subtitle}
              </motion.p>
            )}
            <motion.div className={styles.buttons} variants={itemVariants}>
              <Link
                className={`button button--primary button--lg ${styles.primaryButton}`}
                to={primaryButtonLink}
                onMouseEnter={() => setIsPrimaryButtonHovered(true)}
                onMouseLeave={() => setIsPrimaryButtonHovered(false)}
              >
                <motion.span
                  variants={buttonVariants}
                  animate={isPrimaryButtonHovered ? "hover" : "rest"}
                >
                  {primaryButtonText}
                </motion.span>
              </Link>
              {secondaryButtonText && secondaryButtonLink && (
                <Link
                  className={`button button--secondary button--lg ${styles.secondaryButton}`}
                  to={secondaryButtonLink}
                  onMouseEnter={() => setIsSecondaryButtonHovered(true)}
                  onMouseLeave={() => setIsSecondaryButtonHovered(false)}
                >
                  <motion.span
                    variants={buttonVariants}
                    animate={isSecondaryButtonHovered ? "hover" : "rest"}
                  >
                    {secondaryButtonText}
                  </motion.span>
                </Link>
              )}
            </motion.div>
          </motion.div>
          {imageUrl && (
            <motion.div className={styles.imageContent} variants={itemVariants}>
              <motion.img
                src={imageUrl}
                alt={imageAlt}
                className={styles.heroImage}
                variants={imageVariants}
                whileHover="hover"
              />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        <motion.div
          className={styles.bgCircle}
          animate={{
            y: [0, -10, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={styles.bgCircle}
          animate={{
            y: [-5, 5, -5],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className={styles.bgCircle}
          animate={{
            y: [10, -10, 10],
            opacity: [0.08, 0.18, 0.08]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
    </header>
  );
};

export default AnimatedHeroSection;