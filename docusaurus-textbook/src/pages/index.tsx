import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatureCards from '@site/src/components/HomepageFeatures/HomepageFeatureCards';
import HeroSection from '@site/src/components/AnimatedHeroSection';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HeroSection
        title="PHYSICAL AI & HUMANOID ROBOTICS"
        subtitle="Complete Guide TextBook - Bridging the digital brain with the physical form, Humanoids learning, moving, and intelligently performing"
        primaryButtonText="Start Learning →"
        primaryButtonLink="/docs/Introduction"
        secondaryButtonText="Explore Modules 📚"
        secondaryButtonLink="/docs/Overview-Module-and-Chapter"
        imageUrl="/img/book.png"
        imageAlt="Physical AI & Humanoid Robotics TextBook"
      />
      <main>
        <HomepageFeatureCards />
      </main>
    </Layout>
  );
}
