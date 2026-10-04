import React from 'react';
import {motion} from 'framer-motion';
import Link from '@docusaurus/Link';
import styles from '../css/AnimatedHeroSection.module.css';

interface HeroSectionProps {
  eyebrow?: string;
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
  eyebrow,
  title,
  subtitle,
  primaryButtonText = 'Get started',
  primaryButtonLink = '/docs/Introduction',
  secondaryButtonText,
  secondaryButtonLink,
  imageUrl,
  imageAlt = 'Hero section image',
}) => (
  <header className={styles.heroBanner} aria-labelledby="hero-title">
    <div className={styles.heroGlow} aria-hidden="true" />
    <div className="container">
      <motion.div
        className={styles.heroGrid}
        initial={{opacity: 0, y: 16}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.65, ease: 'easeOut'}}
      >
        <motion.div
          className={styles.textContent}
          initial={{opacity: 0, x: -18}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.65, delay: 0.08, ease: 'easeOut'}}
        >
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 id="hero-title" className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <div className={styles.buttons}>
            <Link className={styles.primaryButton} to={primaryButtonLink}>
              {primaryButtonText}
              <span aria-hidden="true">↗</span>
            </Link>
            {secondaryButtonText && secondaryButtonLink && (
              <Link className={styles.secondaryButton} to={secondaryButtonLink}>
                {secondaryButtonText}
              </Link>
            )}
          </div>
          <div className={styles.heroMeta} aria-label="Book highlights">
            <span>4 learning modules</span>
            <span>ROS 2 → Isaac</span>
            <span>Open source</span>
          </div>
        </motion.div>
        {imageUrl && (
          <motion.div
            className={styles.imageContent}
            initial={{opacity: 0, x: 18, scale: 0.96}}
            animate={{opacity: 1, x: 0, scale: 1}}
            transition={{duration: 0.75, delay: 0.15, ease: 'easeOut'}}
          >
            <div className={styles.imageFrame}>
              <span className={styles.imageKicker}>Field guide / 01</span>
              <motion.img
                src={imageUrl}
                alt={imageAlt}
                className={styles.heroImage}
                animate={{y: [0, -8, 0]}}
                transition={{duration: 6, repeat: Infinity, ease: 'easeInOut'}}
              />
              <span className={styles.imageCaption}>
                The bridge from digital intelligence to physical action.
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  </header>
);

export default AnimatedHeroSection;
