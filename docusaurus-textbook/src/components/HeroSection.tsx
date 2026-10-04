import React, { useState, Fragment } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from '../css/HeroSection.module.css';

interface HeroSectionProps {
  title: string;              // Main heading text (required)
  subtitle?: string;          // Secondary descriptive text (optional)
  primaryButtonText?: string; // Text for primary call-to-action button (optional)
  primaryButtonLink?: string; // URL for primary button (optional)
  secondaryButtonText?: string; // Text for secondary call-to-action button (optional)
  secondaryButtonLink?: string; // URL for secondary button (optional)
  imageUrl?: string;          // Path to hero image (optional)
  imageAlt?: string;          // Alt text for accessibility (optional)
}

const HeroSection: React.FC<HeroSectionProps> = ({
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

  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.textContent}>
            <h1 className={`hero__title ${styles.title}`}>
              {title.includes('Physical AI') ? (
                <>
                  {title.split('Physical AI').map((part, index, array) => (
                    <Fragment key={index}>
                      <span className={styles.titleText}>{part}</span>
                      {index < array.length - 1 && <span className={styles.titleBlue}>Physical AI</span>}
                    </Fragment>
                  ))}
                </>
              ) : (
                <span className={styles.titleText}>{title}</span>
              )}
            </h1>
            {subtitle && (
              <p className={`hero__subtitle ${styles.subtitle}`}>
                {subtitle}
              </p>
            )}
            <div className={styles.buttons}>
              <Link
                className={`button button--primary button--lg ${styles.primaryButton} ${
                  isPrimaryButtonHovered ? styles.hovered : ''
                }`}
                to={primaryButtonLink}
                onMouseEnter={() => setIsPrimaryButtonHovered(true)}
                onMouseLeave={() => setIsPrimaryButtonHovered(false)}
              >
                {primaryButtonText}
              </Link>
              {secondaryButtonText && secondaryButtonLink && (
                <Link
                  className={`button button--secondary button--lg ${styles.secondaryButton} ${
                    isSecondaryButtonHovered ? styles.hovered : ''
                  }`}
                  to={secondaryButtonLink}
                  onMouseEnter={() => setIsSecondaryButtonHovered(true)}
                  onMouseLeave={() => setIsSecondaryButtonHovered(false)}
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
          {imageUrl && (
            <div className={styles.imageContent}>
              <img
                src={imageUrl}
                alt={imageAlt}
                className={styles.heroImage}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeroSection;