# Data Model: Urdu Translation Feature

**Feature**: 001-urdu-translation
**Date**: 2025-12-27
**Version**: 1.0

## Entity: TranslationRequest

### Description
Represents a user's request to translate chapter content to Urdu

### Fields
- **id** (string, required): Unique identifier for the translation request
- **userId** (string, required): ID of the user who initiated the request
- **chapterId** (string, required): ID of the chapter being translated
- **originalContent** (string, required): The original content to be translated
- **targetLanguage** (string, required): Target language code (e.g., "ur" for Urdu)
- **status** (enum, required): Current status of the translation request
  - Values: "pending", "processing", "completed", "failed", "cancelled"
- **createdAt** (datetime, required): Timestamp when request was created
- **startedAt** (datetime, optional): Timestamp when processing started
- **completedAt** (datetime, optional): Timestamp when processing completed
- **error** (string, optional): Error message if status is "failed"
- **wordCount** (number, required): Number of words in the original content
- **requestTokenCount** (number, optional): Number of tokens in the request
- **responseTokenCount** (number, optional): Number of tokens in the response

### Relationships
- Belongs to: User (userId)
- Belongs to: Chapter (chapterId)
- Has one: TranslatedContent (via requestId)

### Validation Rules
- targetLanguage must be "ur" (Urdu)
- originalContent must be between 1 and 17,000 words
- userId must be a valid authenticated user
- chapterId must be a valid existing chapter

### Indexes
- userId (for user's translation history)
- chapterId (for chapter-specific translations)
- status (for processing queue management)
- createdAt (for cache expiration)

## Entity: TranslatedContent

### Description
Stores the translated content once translation is completed

### Fields
- **id** (string, required): Unique identifier for the translated content
- **requestId** (string, required): Reference to the original translation request
- **translatedText** (string, required): The translated content in Urdu
- **wordCount** (number, required): Number of words in the translated content
- **qualityScore** (number, optional): Quality score from validation (0-100)
- **cachedAt** (datetime, required): Timestamp when content was cached
- **expiresAt** (datetime, required): Timestamp when cache expires
- **hash** (string, required): Hash of original content for cache validation
- **processingTimeMs** (number, optional): Time taken to process the translation in milliseconds

### Relationships
- Belongs to: TranslationRequest (requestId)

### Validation Rules
- translatedText must be in Urdu script (Arabic/Persian characters)
- wordCount should match original content word count range
- expiresAt must be in the future
- hash must match the original content

### Indexes
- requestId (for quick lookup)
- hash (for cache validation)

## Entity: UserTranslationPreference

### Description
Stores user preferences related to translation functionality

### Fields
- **id** (string, required): Unique identifier for the preference record
- **userId** (string, required): ID of the user
- **lastTranslationMode** (enum, optional): Last used translation display mode
  - Values: "original", "translated", "toggle"
- **autoTranslateNewChapters** (boolean, optional): Whether to auto-prompt for translation
- **translationQualityFeedback** (object, optional): User feedback on translation quality
- **lastTranslatedAt** (datetime, optional): Timestamp of last translation
- **defaultDisplayMode** (enum, optional): Default display preference
  - Values: "original", "translated", "toggle"

### Relationships
- Belongs to: User (userId)

### Validation Rules
- userId must be a valid authenticated user
- If autoTranslateNewChapters is true, user must have translated at least once

### Indexes
- userId (for user-specific preferences)

## Entity: TranslationQualityFeedback

### Description
Stores feedback from users or reviewers on translation quality

### Fields
- **id** (string, required): Unique identifier for the feedback
- **requestId** (string, required): Reference to the translation request
- **reviewerId** (string, required): ID of the user providing feedback
- **qualityRating** (number, required): Rating from 1-5 for translation quality
- **accuracyRating** (number, optional): Rating from 1-5 for translation accuracy
- **fluencyRating** (number, optional): Rating from 1-5 for language fluency
- **feedbackText** (string, optional): Detailed feedback text
- **isNativeSpeaker** (boolean, optional): Whether reviewer is a native Urdu speaker
- **createdAt** (datetime, required): Timestamp when feedback was created
- **isPositive** (boolean, optional): Whether feedback is positive overall

### Relationships
- Belongs to: TranslationRequest (requestId)
- Belongs to: User (reviewerId)

### Validation Rules
- qualityRating must be between 1 and 5
- accuracyRating must be between 1 and 5 (if provided)
- fluencyRating must be between 1 and 5 (if provided)
- reviewerId must be a valid user

### Indexes
- requestId (for translation-specific feedback)
- reviewerId (for reviewer-specific feedback)
- createdAt (for feedback trends)

## Entity: TranslationCache

### Description
Server-side cache for frequently accessed translations

### Fields
- **id** (string, required): Unique identifier for the cache entry
- **contentHash** (string, required): Hash of the original content
- **targetLanguage** (string, required): Target language code
- **cachedContent** (string, required): The cached translated content
- **accessCount** (number, required): Number of times this translation was accessed
- **lastAccessedAt** (datetime, required): Timestamp of last access
- **expiresAt** (datetime, required): Timestamp when cache expires
- **size** (number, required): Size of cached content in bytes

### Validation Rules
- targetLanguage must be "ur" (Urdu) for this feature
- expiresAt must be in the future
- size must be reasonable for caching (e.g., < 10MB)

### Indexes
- contentHash + targetLanguage (for cache lookup)
- expiresAt (for cache cleanup)
- accessCount (for LRU eviction)

## State Transition Diagrams

### TranslationRequest Status Transitions
```
pending → processing → completed
     ↓         ↓           ↓
   cancelled   ↓           ↓
         failure ←─────────┘
```

- **pending**: Request created, waiting for processing
- **processing**: Translation in progress
- **completed**: Translation successfully completed
- **failed**: Translation failed due to error
- **cancelled**: Request cancelled by user or system

### UserTranslationPreference Display Mode Transitions
```
original ←→ toggle ←→ translated
   ↑           ↑           ↑
   └───────────┴───────────┘
```

## API Schema

### Translation Request Schema
```json
{
  "type": "object",
  "required": ["chapterId", "targetLanguage"],
  "properties": {
    "chapterId": {
      "type": "string",
      "description": "ID of the chapter to translate"
    },
    "targetLanguage": {
      "type": "string",
      "enum": ["ur"],
      "description": "Target language code (Urdu)"
    },
    "displayMode": {
      "type": "string",
      "enum": ["replace", "toggle", "side-by-side"],
      "default": "toggle",
      "description": "How to display translated content"
    }
  }
}
```

### Translation Response Schema
```json
{
  "type": "object",
  "required": ["id", "status", "translatedContent"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Request ID"
    },
    "status": {
      "type": "string",
      "enum": ["pending", "processing", "completed", "failed"]
    },
    "translatedContent": {
      "type": "string",
      "description": "Translated content (when status is completed)"
    },
    "progress": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Progress percentage (when status is processing)"
    },
    "processingTimeMs": {
      "type": "number",
      "description": "Time taken in milliseconds"
    }
  }
}
```