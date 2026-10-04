import React from 'react';
import {Github} from 'lucide-react';

const repositoryUrl = 'https://github.com/HamzaSheikh768/Physical-AI-Humanoid-Robotic-Book';

export default function GitHubNavbarItem(): React.ReactElement {
  return (
    <a
      className="navbar__link navbar__github-link"
      href={repositoryUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open the project on GitHub"
      title="GitHub repository"
    >
      <Github className="navbar__github-icon" size={18} strokeWidth={1.8} aria-hidden="true" />
      <span>GitHub</span>
    </a>
  );
}
