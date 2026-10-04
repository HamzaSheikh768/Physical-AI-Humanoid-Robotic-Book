/**
 * Cache utilities for the Urdu translation feature
 * Implements client-side caching using localStorage with TTL
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time-to-live in milliseconds
  chapterId?: string; // Chapter ID for cache invalidation
  contentHash?: string; // Content hash for cache invalidation
  targetLanguage?: string; // Target language for cache invalidation
}

export class TranslationCache {
  private static readonly CACHE_PREFIX = 'urdu-translation:';
  private static readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Get cached data by key
   * @param key Cache key
   * @returns Cached data if valid, null otherwise
   */
  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      // Server-side, no localStorage available
      return null;
    }

    const fullKey = this.CACHE_PREFIX + key;
    const cached = localStorage.getItem(fullKey);

    if (!cached) {
      return null;
    }

    try {
      const entry: CacheEntry<T> = JSON.parse(cached);

      // Check if cache is expired
      if (Date.now() - entry.timestamp > entry.ttl) {
        localStorage.removeItem(fullKey);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error parsing cached data:', error);
      localStorage.removeItem(fullKey);
      return null;
    }
  }

  /**
   * Set data in cache with TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Time-to-live in milliseconds (optional, defaults to 24 hours)
   * @param chapterId Chapter ID for cache invalidation
   * @param contentHash Content hash for cache invalidation
   * @param targetLanguage Target language for cache invalidation
   */
  static set<T>(
    key: string,
    data: T,
    ttl: number = this.DEFAULT_TTL,
    chapterId?: string,
    contentHash?: string,
    targetLanguage?: string
  ): void {
    if (typeof window === 'undefined') {
      // Server-side, no localStorage available
      return;
    }

    const fullKey = this.CACHE_PREFIX + key;
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      chapterId,
      contentHash,
      targetLanguage
    };

    try {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch (error) {
      console.error('Error setting cached data:', error);
      // If localStorage is full, try to clear expired entries
      this.clearExpired();
      try {
        localStorage.setItem(fullKey, JSON.stringify(entry));
      } catch (retryError) {
        console.error('Failed to cache data after clearing expired entries:', retryError);
      }
    }
  }

  /**
   * Delete data from cache
   * @param key Cache key
   */
  static delete(key: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    const fullKey = this.CACHE_PREFIX + key;
    localStorage.removeItem(fullKey);
  }

  /**
   * Clear all expired cache entries
   */
  static clearExpired(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX)) {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const entry: CacheEntry<any> = JSON.parse(cached);
            if (Date.now() - entry.timestamp > entry.ttl) {
              keysToRemove.push(key);
            }
          } catch (error) {
            // Invalid cache entry, remove it
            keysToRemove.push(key);
          }
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Invalidate cache for a specific chapter
   * @param chapterId Chapter ID to invalidate
   * @param targetLanguage Target language (optional, if specified only that language is invalidated)
   */
  static invalidateChapterCache(chapterId: string, targetLanguage?: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX + 'translation:')) {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const entry: CacheEntry<any> = JSON.parse(cached);
            if (entry.chapterId === chapterId) {
              // If target language is specified, only invalidate that language
              if (targetLanguage) {
                if (entry.targetLanguage === targetLanguage) {
                  keysToRemove.push(key);
                }
              } else {
                // Otherwise invalidate all languages for this chapter
                keysToRemove.push(key);
              }
            }
          } catch (error) {
            // If parsing fails, continue
            continue;
          }
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Invalidate cache for content that has changed
   * @param chapterId Chapter ID
   * @param oldContentHash Hash of the old content
   * @param targetLanguage Target language
   */
  static invalidateContentCache(chapterId: string, oldContentHash: string, targetLanguage: string = 'ur'): void {
    if (typeof window === 'undefined') {
      return;
    }

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX + 'translation:')) {
        const cached = localStorage.getItem(key);
        if (cached) {
          try {
            const entry: CacheEntry<any> = JSON.parse(cached);
            if (entry.chapterId === chapterId &&
                entry.contentHash === oldContentHash &&
                entry.targetLanguage === targetLanguage) {
              keysToRemove.push(key);
            }
          } catch (error) {
            // If parsing fails, continue
            continue;
          }
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Generate cache key for translation
   * @param chapterId Chapter ID
   * @param contentHash Hash of the content to translate
   * @param targetLanguage Target language (default: 'ur')
   */
  static generateTranslationKey(chapterId: string, contentHash: string, targetLanguage: string = 'ur'): string {
    return `translation:${chapterId}:${targetLanguage}:${contentHash}`;
  }

  /**
   * Clear all translation cache entries
   */
  static clearAllTranslations(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.CACHE_PREFIX + 'translation:')) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

/**
 * Simple hash function to generate content hash
 * @param content Content to hash
 * @returns Hash string
 */
export function generateContentHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36); // Convert to base-36 string
}