import React from 'react';
import type {CardLayout} from './types';
import FeatureCard from '@site/src/components/FeatureCard';
import styles from './styles.module.css';
import {featureCardsData} from './data';

interface HomepageFeatureCardsProps {
  layout?: CardLayout;
}

const HomepageFeatureCards: React.FC<HomepageFeatureCardsProps> = ({
  layout = {
    cards: featureCardsData,
    layoutType: 'grid',
    maxCardsPerRow: 4,
  },
}) => {
  const {cards} = layout;

  return (
    <section
      className={styles.featuresSection}
      aria-labelledby="features-title"
      role="region"
    >
      <div className={styles.container}>
        <div className={styles.sectionIntro}>
          <p className={styles.sectionEyebrow}>Inside the book</p>
          <h2 id="features-title" className={styles.sectionTitle} tabIndex={-1}>
            From first principles to field-ready systems.
          </h2>
          <p className={styles.sectionDescription}>
            A structured path through the tools, ideas, and engineering decisions that make embodied intelligence work in the real world.
          </p>
        </div>
        <div className={styles.grid} role="list">
          {cards.map((card, index) => (
            <div role="listitem" key={card.id}>
              <FeatureCard
                title={card.title}
                description={card.description}
                href={card.linkUrl}
                linkText={card.linkText}
                index={index + 1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageFeatureCards;
