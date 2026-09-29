import type { FeatureCard } from './types';

export const featureCardsData: FeatureCard[] = [
  {
    id: 'feature-1',
    title: 'The Robot Operating System',
    description: 'Build your foundation in ROS 2, nodes, topics, and services—the building blocks that let intelligent robot systems communicate and act.',
    imageUrl: '/img/module-ros.svg',
    linkUrl: '/docs/Module-1-ROS2/Nodes-Topics-Services',
    linkText: 'Explore Tutorials',
    order: 1
  },
  {
    id: 'feature-2',
    title: 'Simulation & Digital Twins',
    description: 'Create virtual robotics worlds, test ideas safely, and build a bridge between high-fidelity simulation and physical machines.',
    imageUrl: '/img/module-simulation.svg',
    linkUrl: '/docs/Module-2-Digital-Twin/Gazebo-Setup-and-Simulation',
    linkText: 'Explore Tutorials',
    order: 2
  },
  {
    id: 'feature-3',
    title: 'The AI Robot Brain',
    description: 'Connect perception, planning, and action with modern AI tools to give robots the context to navigate and interact with the world.',
    imageUrl: '/img/module-intelligence.svg',
    linkUrl: '/docs/Module-3-AI-Robot-Brain/NVIDIA-Isaac-Platform',
    linkText: 'Explore Tutorials',
    order: 3
  },
  {
    id: 'feature-4',
    title: 'Vision, Language & Action',
    description: 'Explore how vision-language-action models turn perception and natural language into purposeful movement in humanoid robots.',
    imageUrl: '/img/module-vla.svg',
    linkUrl: '/docs/Module-4-Vision-Language-Action/Humanoid-Kinematics-and-Locomotion',
    linkText: 'Explore Tutorials',
    order: 4
  }
];
