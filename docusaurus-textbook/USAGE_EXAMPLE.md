# Urdu Translation Feature Usage Example

This document shows how to use the Urdu translation feature in your Docusaurus pages.

## Component Integration

To add the translation feature to any chapter page, import and use the `TranslationButton` component:

```jsx
import TranslationButton from '../components/TranslationButton/TranslationButton';

// Example usage in a page component
const ExampleChapterPage = () => {
  const chapterContent = `
    <h1>Introduction to Robotics</h1>
    <p>Robotics is an interdisciplinary branch of engineering and science that includes mechanical engineering, electrical engineering, computer science, and others.</p>
    <p>It deals with the design, construction, operation, and use of robots, as well as computer systems for their control, sensory feedback, and information processing.</p>
  `;

  return (
    <div className="container margin-vert--lg">
      <div className="row">
        <div className="col col--8 col--offset-2">
          <h1>Robotics Chapter</h1>

          {/* Translation button that appears at the start of the chapter */}
          <TranslationButton
            chapterId="intro-to-robotics"
            content={chapterContent}
            targetLanguage="ur"
          />

          {/* Original content will be displayed either in original or translated form */}
          <div
            className="chapter-content"
            dangerouslySetInnerHTML={{ __html: chapterContent }}
          />
        </div>
      </div>
    </div>
  );
};

export default ExampleChapterPage;
```

## How It Works

1. Place the `TranslationButton` component at the beginning of each chapter
2. Pass the chapter content as a prop
3. Provide a unique chapter ID
4. The button will only appear to authenticated users
5. When clicked, it translates the content to Urdu and provides toggle functionality