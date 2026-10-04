# Quickstart Guide: Urdu Translation Feature

**Feature**: 001-urdu-translation
**Date**: 2025-12-27
**Version**: 1.0

## Overview

This guide provides a quick introduction to implementing the Urdu Translation feature for chapter content. The feature allows authenticated users to translate chapter content to Urdu with a single button click, with translations completed within 5 seconds for content up to 13,000 words.

## Prerequisites

- Node.js 18+ and npm/yarn
- Docusaurus project with authentication system
- OpenAI API key for the gpt-5.1-codex-max model
- Git repository with feature branch setup

## Setup

### 1. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Add your OpenAI API key
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL_PATH=openai/gpt-5.1-codex-max
```

### 2. Install Dependencies

```bash
npm install openai @docusaurus/core
```

### 3. Project Structure

```
src/
├── components/
│   └── TranslationButton/
│       ├── TranslationButton.tsx
│       ├── TranslationDisplay.tsx
│       └── TranslationService.ts
├── pages/
│   └── api/
│       └── translate.ts
└── utils/
    └── cache.ts
```

## Implementation Steps

### Step 1: Create Translation Button Component

Create `src/components/TranslationButton/TranslationButton.tsx`:

```tsx
import React, { useState } from 'react';

interface TranslationButtonProps {
  chapterId: string;
  content: string;
}

const TranslationButton: React.FC<TranslationButtonProps> = ({ chapterId, content }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'original' | 'translated'>('original');

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chapterId,
          content,
          targetLanguage: 'ur',
        }),
      });

      const data = await response.json();
      if (data.translatedContent) {
        setTranslatedContent(data.translatedContent);
        setDisplayMode('translated');
      }
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDisplay = () => {
    setDisplayMode(displayMode === 'original' ? 'translated' : 'original');
  };

  return (
    <div className="translation-controls">
      {displayMode === 'original' && (
        <button
          onClick={handleTranslate}
          disabled={isLoading}
          className="translation-button"
        >
          {isLoading ? 'Translating...' : 'Translate to Urdu'}
        </button>
      )}

      {translatedContent && (
        <button
          onClick={toggleDisplay}
          className="toggle-button"
        >
          {displayMode === 'original' ? 'Show Urdu' : 'Show Original'}
        </button>
      )}
    </div>
  );
};

export default TranslationButton;
```

### Step 2: Create Translation API Endpoint

Create `src/pages/api/translate.ts`:

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, targetLanguage, chapterId } = req.body;

  if (!content || !targetLanguage || !chapterId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const start = Date.now();
    const completion = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL_PATH || 'gpt-5.1-codex-max',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator. Translate the following content to Urdu while preserving the meaning and formatting as much as possible.'
        },
        {
          role: 'user',
          content: `Translate the following text to ${targetLanguage}:\n\n${content}`
        }
      ],
      max_tokens: Math.ceil(content.length / 4), // Rough estimate for Urdu
    });

    const translatedText = completion.data.choices[0].message?.content || '';
    const processingTime = Date.now() - start;

    res.status(200).json({
      id: `${chapterId}-${Date.now()}`,
      translatedContent: translatedText,
      processingTimeMs: processingTime,
      status: 'completed'
    });
  } catch (error) {
    console.error('Translation API error:', error);
    res.status(500).json({
      error: 'Translation failed',
      status: 'failed'
    });
  }
}
```

### Step 3: Create Translation Service

Create `src/components/TranslationButton/TranslationService.ts`:

```ts
// TranslationService.ts
export interface TranslationRequest {
  chapterId: string;
  content: string;
  targetLanguage: string;
  userId?: string;
}

export interface TranslationResponse {
  id: string;
  translatedContent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  processingTimeMs?: number;
  progress?: number;
}

export class TranslationService {
  private static readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  static async translate(request: TranslationRequest): Promise<TranslationResponse> {
    // Check cache first
    const cacheKey = this.getCacheKey(request);
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    // Call API
    const response = await this.callTranslationAPI(request);

    // Cache the result
    if (response.status === 'completed') {
      this.saveToCache(cacheKey, response);
    }

    return response;
  }

  private static getCacheKey(request: TranslationRequest): string {
    return `translation_${request.chapterId}_${request.targetLanguage}_${request.content.length}`;
  }

  private static getFromCache(key: string): TranslationResponse | null {
    if (typeof window === 'undefined') return null; // Server-side

    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.cachedAt > this.CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  }

  private static saveToCache(key: string, data: TranslationResponse): void {
    if (typeof window === 'undefined') return; // Server-side

    const cacheEntry = {
      data,
      cachedAt: Date.now(),
    };

    localStorage.setItem(key, JSON.stringify(cacheEntry));
  }

  private static async callTranslationAPI(request: TranslationRequest): Promise<TranslationResponse> {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    return response.json();
  }
}
```

### Step 4: Integrate into Docusaurus Pages

Update your chapter pages to include the translation button:

```tsx
// In your chapter MDX file or layout component
import TranslationButton from '@site/src/components/TranslationButton/TranslationButton';

// In your MDX content or page component
<TranslationButton
  chapterId="chapter-1"
  content={/* the chapter content */}
/>
```

## Testing

### Unit Tests

```bash
npm test TranslationButton.test.tsx
```

### Integration Tests

```bash
# Test API endpoint
npm run test-api

# End-to-end tests
npm run test-e2e
```

## Performance Optimization

### Caching Strategy
- Server-side caching for popular translations
- Client-side caching for recent translations
- TTL-based cache expiration

### Content Chunking
- Large chapters (>10k words) are chunked into smaller segments
- Parallel processing of chunks
- Reassembly with proper formatting

## Security Considerations

1. **API Key Security**: Never expose API keys in client-side code
2. **Authentication**: Only authenticated users can access translation
3. **Content Validation**: Sanitize input and output content
4. **Rate Limiting**: Implement proper rate limiting on API calls

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure `OPENAI_API_KEY` is properly set in environment
   - Check for typos in the API key

2. **Rate Limiting**
   - Implement proper queuing for translation requests
   - Use caching to reduce API calls

3. **Performance Issues**
   - Verify caching is working properly
   - Check for large content chunks that exceed limits

### Debugging

```bash
# Enable debug logging
DEBUG=translation:* npm start
```

## Next Steps

1. Deploy to staging environment
2. Conduct user testing with Urdu speakers
3. Monitor performance and quality metrics
4. Optimize based on usage patterns
