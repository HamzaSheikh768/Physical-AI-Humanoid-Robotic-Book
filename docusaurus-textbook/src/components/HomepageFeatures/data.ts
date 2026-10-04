import type { FeatureCard } from './types';

export const featureCardsData: FeatureCard[] = [
  {
    id: 'feature-1',
    title: 'AI Physical Humanoid Robotics',
    description: 'Learn how to build intelligent humanoid robots with cutting-edge AI. Master the integration of AI algorithms with physical robotic systems to create truly autonomous humanoids.',
    imageUrl: '/img/feature-1.svg',
    linkUrl: '/docs/Introduction',
    linkText: 'Explore Tutorials',
    order: 1
  },
  {
    id: 'feature-2',
    title: 'Agentic AI',
    description: 'Understand autonomous agents that can reason, plan, and take actions independently. Learn how to build AI systems that exhibit goal-directed behavior and decision-making capabilities.',
    imageUrl: '/img/feature-2.svg',
    linkUrl: '/docs/Setup-Guide',
    linkText: 'Explore Tutorials',
    order: 2
  },
  {
    id: 'feature-3',
    title: 'Python & TypeScript',
    description: 'Master the essential programming languages for AI and robotics development. Learn how to leverage Python for AI/ML and TypeScript for robust, scalable applications.',
    imageUrl: '/img/feature-3.svg',
    linkUrl: '/docs/Conclusion',
    linkText: 'Explore Tutorials',
    order: 3
  },
  {
    id: 'feature-4',
    title: 'Production-ready AI Systems',
    description: 'Deploy and scale AI systems in real-world environments. Learn best practices for building robust, reliable, and maintainable AI applications.',
    imageUrl: '/img/cloud-training-local-inference-flow.svg',
    linkUrl: '/docs/Conclusion',
    linkText: 'Explore Tutorials',
    order: 4
  }
];
