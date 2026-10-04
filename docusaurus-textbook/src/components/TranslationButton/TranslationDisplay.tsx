import React, { useState, useEffect, useRef } from 'react';
import '@site/static/css/translation-button.css';

interface TranslationDisplayProps {
  originalContent: string;
  translatedContent: string | null;
  targetLanguage?: string;
  className?: string;
  onToggle?: (mode: 'original' | 'translated') => void;
  chunkSize?: number; // Number of characters to load at a time for progressive loading
}

const TranslationDisplay: React.FC<TranslationDisplayProps> = ({
  originalContent,
  translatedContent,
  targetLanguage = 'ur',
  className = '',
  onToggle,
  chunkSize = 1000 // Default chunk size of 1000 characters
}) => {
  const [displayMode, setDisplayMode] = useState<'original' | 'translated'>('translated');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedContent, setLoadedContent] = useState<string>('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showProgressiveLoad, setShowProgressiveLoad] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const fullTranslatedContent = useRef<string>('');

  useEffect(() => {
    if (onToggle) {
      onToggle(displayMode);
    }
  }, [displayMode, onToggle]);

  useEffect(() => {
    if (translatedContent) {
      fullTranslatedContent.current = translatedContent;
      // For shorter content, load it all at once
      if (translatedContent.length <= chunkSize) {
        setLoadedContent(translatedContent);
        setShowProgressiveLoad(false);
      } else {
        // For longer content, start with first chunk and enable progressive loading
        setLoadedContent(translatedContent.substring(0, chunkSize));
        setShowProgressiveLoad(true);
      }
    }
  }, [translatedContent, chunkSize]);

  const toggleDisplay = () => {
    setIsTransitioning(true);

    // Trigger reflow to restart animation
    setTimeout(() => {
      setDisplayMode(prev => prev === 'original' ? 'translated' : 'original');
      setIsTransitioning(false);
    }, 10);
  };

  const loadMoreContent = () => {
    if (!showProgressiveLoad || isLoadingMore) return;

    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    setTimeout(() => {
      const currentLength = loadedContent.length;
      const nextChunk = fullTranslatedContent.current.substring(
        currentLength,
        currentLength + chunkSize
      );

      setLoadedContent(prev => prev + nextChunk);

      // Check if we've loaded all content
      if (currentLength + chunkSize >= fullTranslatedContent.current.length) {
        setShowProgressiveLoad(false);
      }

      setIsLoadingMore(false);
    }, 300); // 300ms delay to simulate loading
  };

  // Check if we should show load more button
  const shouldShowLoadMore = showProgressiveLoad &&
                            displayMode === 'translated' &&
                            loadedContent.length < fullTranslatedContent.current.length;

  if (!translatedContent) {
    return (
      <div className={`translation-display ${className}`}>
        <div className="original-content">
          <div dangerouslySetInnerHTML={{ __html: originalContent }} />
        </div>
      </div>
    );
  }

  return (
    <div className={`translation-display ${className}`} role="region" aria-label="Translation display">
      <div className="translation-controls" role="toolbar" aria-label="Translation controls">
        <button
          onClick={toggleDisplay}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleDisplay();
            }
          }}
          className={`toggle-button ${displayMode === 'original' ? 'active' : ''}`}
          aria-label={
            displayMode === 'original'
              ? 'Show translated content'
              : 'Show original content'
          }
          aria-pressed={displayMode === 'translated'}
          tabIndex={0}
        >
          {displayMode === 'original' ? 'Show Urdu' : 'Show Original'}
        </button>

        {shouldShowLoadMore && (
          <button
            onClick={loadMoreContent}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                loadMoreContent();
              }
            }}
            disabled={isLoadingMore}
            className="load-more-button"
            aria-label="Load more translated content"
            tabIndex={0}
          >
            {isLoadingMore ? 'Loading more...' : 'Load More Content'}
          </button>
        )}
      </div>

      <div
        ref={contentRef}
        className={`translation-content-wrapper ${isTransitioning ? 'transitioning' : ''}`}
        role="main"
        aria-live="polite"
      >
        {displayMode === 'original' ? (
          <div className="original-content" lang="en">
            <div
              dangerouslySetInnerHTML={{ __html: originalContent }}
              tabIndex={0}
              style={{ outline: 'none' }}
            />
          </div>
        ) : (
          <div
            className="translated-content"
            lang={targetLanguage}
            dir={targetLanguage === 'ur' ? 'rtl' : 'ltr'} // Right-to-left for Urdu
            aria-label="Urdu translation content"
            tabIndex={0}
            style={{ outline: 'none' }}
          >
            {loadedContent}
            {shouldShowLoadMore && (
              <div className="loading-indicator" role="status" aria-live="polite">
                {isLoadingMore && (
                  <div className="progress-spinner" aria-label="Loading more content">
                    <div className="spinner" aria-hidden="true"></div>
                    <span>Loading more content...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationDisplay;

// Add basic styles for the translation display components
