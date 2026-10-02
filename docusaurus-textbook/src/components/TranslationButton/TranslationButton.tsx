import React, { useState, useEffect, useRef } from 'react';
import { TranslationService } from './TranslationService';
import { isAuthenticated } from '../../utils/auth';
import TranslationDisplay from './TranslationDisplay';
import '/css/translation-button.css';

interface TranslationButtonProps {
  chapterId: string;
  content: string;
  targetLanguage?: string;
  className?: string;
}

const TranslationButton: React.FC<TranslationButtonProps> = ({
  chapterId,
  content,
  targetLanguage = 'ur',
  className = ''
}) => {
  const [isAuthenticatedUser, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const isMountedRef = useRef(true);

  // Set authenticated state to true to allow translation for all users
  useEffect(() => {
    setIsAuthenticated(true);
  }, []);

  const handleTranslate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await TranslationService.translate({
        chapterId,
        content,
        targetLanguage,
        userId: null  // No user ID needed when not authenticated
      });

      if (!isMountedRef.current) return; // Prevent state update if component unmounted

      if (result.status === 'completed' && result.translatedContent) {
        setTranslatedContent(result.translatedContent);
        setShowTranslation(true);
      } else if (result.status === 'failed') {
        setError(result.error || 'Translation failed');
      }
    } catch (err) {
      if (!isMountedRef.current) return; // Prevent state update if component unmounted

      console.error('Translation error:', err);
      setError('An error occurred during translation');
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };


  return (
    <div className={`translation-button-container ${className}`} role="region" aria-label="Urdu translation controls">
      {!showTranslation ? (
        <div className="translation-initial-view" role="group" aria-labelledby="translate-to-urdu-button">
          <button
            id="translate-to-urdu-button"
            onClick={handleTranslate}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTranslate();
              }
            }}
            disabled={isLoading}
            className={`button button--primary button--sm ${isLoading ? 'button--loading' : ''}`}
            aria-label={isLoading ? "Translation in progress" : "Translate content to Urdu"}
            aria-describedby={error ? "translation-error-message" : undefined}
            tabIndex={0}
          >
            {isLoading ? 'Translating...' : 'Translate to Urdu'}
          </button>

          {isLoading && (
            <div className="loading-indicator" role="status" aria-live="polite">
              <div className="spinner" aria-hidden="true"></div>
              <span>Translating content to Urdu...</span>
            </div>
          )}

          {error && (
            <div className="error-message" role="alert" id="translation-error-message">
              <span className="error-text">{error}</span>
              <button
                onClick={handleTranslate}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTranslate();
                  }
                }}
                className="button button--secondary button--sm retry-button"
                aria-label="Retry translation"
                tabIndex={0}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      ) : (
        <TranslationDisplay
          originalContent={content}
          translatedContent={translatedContent}
          targetLanguage={targetLanguage}
          onToggle={(mode) => setShowTranslation(mode === 'translated')}
        />
      )}
    </div>
  );
};

export default TranslationButton;
