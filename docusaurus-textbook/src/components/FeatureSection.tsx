import React from 'react';
import FeatureCard from './FeatureCard';
import styles from '../css/FeatureSection.module.css';

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: "AI Physical Humanoid Robotics",
      description: "Learn to build intelligent humanoid robots with cutting-edge AI"
    },
    {
      title: "Agentic AI",
      description: "Understand autonomous agents that can reason and take actions"
    },
    {
      title: "Python & TypeScript",
      description: "Master the languages powering modern AI applications"
    },
    {
      title: "Production-ready AI systems",
      description: "Deploy and scale AI systems in real-world environments"
    }
  ];

  return (
    <section className={styles.featureSection}>
      <div className={styles.featureGrid}>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;