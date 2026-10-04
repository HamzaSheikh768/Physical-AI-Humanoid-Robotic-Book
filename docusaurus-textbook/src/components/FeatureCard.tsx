import React, {useState} from 'react';
import {motion} from 'framer-motion';
import Link from '@docusaurus/Link';
import styles from '../css/FeatureCard.module.css';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: string;
  href?: string;
  linkText?: string;
  index?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description = '',
  icon,
  href,
  linkText = 'Read chapter',
  index = 1,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={styles.featureCard}
      animate={{y: isHovered ? -6 : 0}}
      whileTap={{scale: 0.99}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{duration: 0.2, ease: 'easeOut'}}
    >
      <div className={styles.cardTopline}>
        <span className={styles.index}>{String(index).padStart(2, '0')}</span>
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </div>
      {icon && <div className={styles.icon} aria-hidden="true">{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {href && (
        <Link className={styles.featureLink} to={href}>
          {linkText}
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </motion.div>
  );
};

export default FeatureCard;
