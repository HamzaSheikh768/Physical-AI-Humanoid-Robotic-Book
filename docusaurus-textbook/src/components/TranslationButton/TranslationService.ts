import { TranslationCache, generateContentHash } from '../../utils/cache';
import { isAuthenticated, getCurrentUserId } from '../../utils/auth';

interface TranslationRequest {
  chapterId: string;
  content: string;
  targetLanguage: string;
  userId?: string;
}

interface TranslationResponse {
  id: string;
  translatedContent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTimeMs?: number;
  progress?: number;
  error?: string;
}

declare global {
  interface Window {
    __themeInitializationData?: {
      siteConfig?: {
        customFields?: Record<string, unknown>;
      };
    };
  }
}

export class TranslationService {
  private static readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  private static readonly RETRY_DELAY = 1000; // 1 second

  static async translate(request: TranslationRequest): Promise<TranslationResponse> {
    // Allow translation for all users (no authentication required)

    // Check cache first using content hash
    const contentHash = generateContentHash(request.content);
    const cacheKey = TranslationCache.generateTranslationKey(
      request.chapterId,
      contentHash,
      request.targetLanguage
    );

    const cached = TranslationCache.get<TranslationResponse>(cacheKey);
    if (cached) {
      return cached;
    }

    // Try to call the translation API with retry logic
    let result: TranslationResponse;
    try {
      result = await this.callTranslationAPI(request, contentHash);
    } catch (error) {
      console.error('Translation API error:', error);

      // If the API is unavailable, try to return a cached version if available (even if expired)
      const fallbackResult = this.getFallbackTranslation(request, contentHash);
      if (fallbackResult) {
        return {
          ...fallbackResult,
          status: 'completed',
          error: 'Translation service temporarily unavailable, showing cached version'
        };
      }

      // If no fallback is available, return a graceful error response
      return {
        id: `${request.chapterId}-${Date.now()}`,
        translatedContent: '',
        status: 'failed',
        error: this.getGracefulErrorMessage(error),
      };
    }

    // Cache the result if successful with additional metadata for invalidation
    if (result.status === 'completed' && result.translatedContent) {
      TranslationCache.set(
        cacheKey,
        result,
        this.CACHE_TTL,
        request.chapterId,
        contentHash,
        request.targetLanguage
      );
    }

    return result;
  }

  /**
   * Call the translation API with retry logic
   */
  private static async callTranslationAPI(
    request: TranslationRequest,
    contentHash: string
  ): Promise<TranslationResponse> {
    // Use user ID if provided, otherwise use null for unauthenticated users
    const userId = request.userId !== null ? request.userId : null;

    // For Docusaurus, we need to use a different approach since it doesn't have built-in API routes
    // Use a direct translation service API (e.g., Google Translate, Azure Translator, etc.)
    // Access the custom field from Docusaurus config
    const isBrowser = typeof window !== 'undefined';

    // Get the translation API URL from Docusaurus custom fields
    let docusaurusTranslationApiUrl = undefined;
    if (isBrowser && window.__themeInitializationData && window.__themeInitializationData.siteConfig) {
      docusaurusTranslationApiUrl = window.__themeInitializationData.siteConfig.customFields?.TRANSLATION_API_URL as string | undefined;
    }

    // Fallback to environment variable or default URL
    const apiUrl = docusaurusTranslationApiUrl ||
      (isBrowser ?
        (window.location.hostname === 'localhost' ?
          'http://localhost:3001/api/translate' : // For development
          '/api/translate')  // For production
        : 'http://localhost:3001/api/translate'); // For Node.js environment (SSR)

    // Try the API call with retry logic
    for (let attempt = 1; attempt <= this.MAX_RETRY_ATTEMPTS; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...request,
            userId
          }),
        });

        if (!response.ok) {
          // If it's a timeout error, try again
          if (response.status === 408) {
            console.warn(`Translation API timeout (attempt ${attempt}/${this.MAX_RETRY_ATTEMPTS})`);
            if (attempt === this.MAX_RETRY_ATTEMPTS) {
              throw new Error(`Translation API timed out after ${this.MAX_RETRY_ATTEMPTS} attempts`);
            }
            // Wait before retrying
            await this.delay(this.RETRY_DELAY * attempt);
            continue;
          }

          // If it's a service unavailable error, try again
          if (response.status === 503 || response.status === 502) {
            console.warn(`Translation API unavailable (attempt ${attempt}/${this.MAX_RETRY_ATTEMPTS})`);
            if (attempt === this.MAX_RETRY_ATTEMPTS) {
              throw new Error(`Translation service unavailable after ${this.MAX_RETRY_ATTEMPTS} attempts`);
            }
            // Wait before retrying
            await this.delay(this.RETRY_DELAY * attempt);
            continue;
          }

          // Handle 404 specifically - if the endpoint doesn't exist, try a fallback approach
          if (response.status === 404) {
            console.warn('Translation API endpoint not found, attempting fallback translation...');
            // Return a fallback response if the API endpoint doesn't exist
            return {
              id: `${request.chapterId}-${Date.now()}`,
              translatedContent: `Translation service unavailable. Original content:\n\n${request.content}`,
              status: 'completed',
              error: 'Translation service not available'
            };
          }

          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        return {
          id: data.id || `${request.chapterId}-${Date.now()}`,
          translatedContent: data.translatedContent || '',
          status: data.status || 'completed',
          processingTimeMs: data.processingTimeMs,
          progress: data.progress,
          error: data.error,
        };
      } catch (error) {
        console.error(`Translation API attempt ${attempt} failed:`, error);

        if (attempt === this.MAX_RETRY_ATTEMPTS) {
          throw error; // Re-throw the error if we've exhausted retries
        }

        // Wait before retrying (with exponential backoff)
        await this.delay(this.RETRY_DELAY * attempt);
      }
    }

    // This should never be reached due to the loop structure, but added for type safety
    throw new Error('Translation failed after all retry attempts');
  }

  /**
   * Get fallback translation from older cached versions or alternative sources
   */
  private static getFallbackTranslation(
    request: TranslationRequest,
    contentHash: string
  ): TranslationResponse | null {
    // Try to find an older version of the translation for the same chapter
    // This could be from a previous version of the content
    try {
      // Get all cached translations for this chapter
      if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('urdu-translation:translation:' + request.chapterId)) {
            const cached = localStorage.getItem(key);
            if (cached) {
              try {
                const entry = JSON.parse(cached);
                if (entry.data && entry.data.translatedContent) {
                  // Return the most recent cached translation we can find
                  return {
                    id: entry.data.id || `${request.chapterId}-${Date.now()}`,
                    translatedContent: entry.data.translatedContent,
                    status: 'completed',
                    processingTimeMs: entry.data.processingTimeMs,
                    progress: entry.data.progress,
                    error: 'Showing cached translation due to service unavailability'
                  };
                }
              } catch (parseError) {
                console.error('Error parsing fallback cache entry:', parseError);
                continue;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error retrieving fallback translation:', error);
    }

    return null;
  }

  /**
   * Generate a graceful error message based on the error type
   */
  private static getGracefulErrorMessage(error: any): string {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    if (errorMessage.toLowerCase().includes('timeout')) {
      return 'Translation service is taking longer than expected. Please try again later.';
    }

    if (errorMessage.toLowerCase().includes('unavailable') ||
        errorMessage.toLowerCase().includes('503') ||
        errorMessage.toLowerCase().includes('502')) {
      return 'Translation service is temporarily unavailable. Please try again later.';
    }

    if (errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('fetch')) {
      return 'Unable to connect to translation service. Please check your internet connection.';
    }

    return `Translation service error: ${errorMessage}. Please try again later.`;
  }

  /**
   * Simple delay function for retry logic
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check if translation is available in cache
   * @param chapterId Chapter ID
   * @param content Content to translate
   * @param targetLanguage Target language
   * @returns Cached translation if available, null otherwise
   */
  static getCachedTranslation(
    chapterId: string,
    content: string,
    targetLanguage: string = 'ur'
  ): TranslationResponse | null {
    const contentHash = generateContentHash(content);
    const cacheKey = TranslationCache.generateTranslationKey(
      chapterId,
      contentHash,
      targetLanguage
    );

    return TranslationCache.get<TranslationResponse>(cacheKey);
  }

  /**
   * Clear cached translation for a specific chapter
   * @param chapterId Chapter ID
   * @param targetLanguage Target language
   */
  static clearCachedTranslation(chapterId: string, targetLanguage: string = 'ur'): void {
    TranslationCache.invalidateChapterCache(chapterId, targetLanguage);
  }

  /**
   * Invalidate cache when content has changed
   * @param chapterId Chapter ID
   * @param oldContentHash Hash of the old content
   * @param targetLanguage Target language
   */
  static invalidateContentCache(chapterId: string, oldContentHash: string, targetLanguage: string = 'ur'): void {
    TranslationCache.invalidateContentCache(chapterId, oldContentHash, targetLanguage);
  }

  /**
   * Clear all translation cache
   */
  static clearAllTranslations(): void {
    TranslationCache.clearAllTranslations();
  }
}
