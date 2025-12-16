import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "Physical AI & Humanoid Robotics: Complete Guide TextBook",
  tagline:
    "Bridging the digital brain with the physical form, Humanoids learning, moving, and intelligently performing, From ROS 2 to NVIDIA Isaac, simulations come alive, Master embodied AI and guide robots to thrive in the real world, Explore perception, planning, and action with cutting-edge AI, Transform knowledge into intelligent, autonomous humanoids.",
  favicon: "img/robot-favicon.svg",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://hamzasheikh768.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/Physical-AI-Humanoid-Robotic-Book/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "HamzaSheikh768", // Usually your GitHub org/user name.
  projectName: "Physical-AI-Humanoid-Robotic-Book", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/HamzaSheikh768/Physical-AI-Humanoid-Robotic-Book/edit/main/docusaurus-textbook/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/HamzaSheikh768/Physical-AI-Humanoid-Robotic-Book/edit/main/docusaurus-textbook/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
  ],
  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Physical AI & Humanoid Robotic",
      logo: {
        alt: "Physical AI & Humanoid Robotic Book Logo",
        src: "img/robot-logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "TextBook",
        },
        // { to: "/blog", label: "Blog", position: "left" },
        {
          href: "https://github.com/HamzaSheikh768/Physical-AI-Humanoid-Robotic-Book",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Introduction",
              to: "/docs/Introduction",
            },
            {
              label: "Setup Guide",
              to: "/docs/Setup-Guide",
            },
            {
              label: "Capstone",
              to: "/docs/Capstone",
            },
            {
              label: "Conclusion",
              to: "/docs/Conclusion",
            },
          ],
        },
        {
          title: "Modules",
          items: [
            {
              label: "Module 1 – ROS 2",
              to: "/docs/Module-1-ROS2",
            },
            {
              label: "Module 2 – Digital Twin",
              to: "/docs/Module-2-Digital-Twin",
            },
            {
              label: "Module 3 – AI Robot Brain",
              to: "/docs/Module-3-AI-Robot-Brain",
            },
            {
              label: "Module 4 – Vision Language Action",
              to: "/docs/Module-4-Vision-Language-Action",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/HamzaSheikh768/Physical-AI-Humanoid-Robotic-Book",
            },
            {
              label: "References",
              to: "/docs/Reference",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Hamza Sheikh. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
