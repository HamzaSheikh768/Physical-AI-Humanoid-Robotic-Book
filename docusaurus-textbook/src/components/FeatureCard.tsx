import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../css/FeatureCard.module.css';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: string;
  themeColor?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description = "",
  icon,
  themeColor = "#2563eb"
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    rest: {
      y: 0,
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: {
      y: -10,
      scale: 1.02,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
    }
  };

  return (
    <motion.div
      className={styles.featureCard}
      variants={cardVariants}
      animate={isHovered ? "hover" : "rest"}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </motion.div>
  );
};

export default FeatureCard;