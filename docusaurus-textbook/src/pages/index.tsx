import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatureCards from '@site/src/components/HomepageFeatures/HomepageFeatureCards';
import HeroSection from '@site/src/components/AnimatedHeroSection';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A practical guide to physical AI, humanoid robotics, and production-ready intelligent systems.">
      <HeroSection
        eyebrow="The physical AI field guide"
        title="Build intelligence that can move."
        subtitle="A complete textbook for learning how digital brains become capable physical systems — from ROS 2 and simulation to perception, planning, and humanoid action."
        primaryButtonText="Start learning"
        primaryButtonLink="/docs/Introduction"
        secondaryButtonText="Explore the modules"
        secondaryButtonLink="/docs/Overview-Module-and-Chapter"
        imageUrl="/img/book.png"
        imageAlt="Physical AI and Humanoid Robotics textbook cover"
      />
      <main>
        <HomepageFeatureCards />
      </main>
    </Layout>
  );
}
