# Urdu Translation Feature

This feature enables users to translate chapter content to Urdu with a single button click.

## Setup

1. **Environment Variables**: Create a `.env` file in the project root with the following:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL_PATH=gpt-3.5-turbo  # Optional, defaults to gpt-3.5-turbo
   ```

2. **Install Dependencies**: Make sure you have all required dependencies installed:
   ```bash
   npm install openai express cors dotenv
   npm install --save-dev concurrently
   ```

3. **Run the Application**: Use the dev script to run both the Docusaurus server and translation API:
   ```bash
   npm run dev
   ```
   This will start:
   - Docusaurus server on the default port (usually 3000)
   - Translation API server on port 3001

## Components

- `TranslationButton`: The main UI component that triggers translation
- `TranslationDisplay`: Shows both original and translated content with toggle functionality
- `TranslationService`: Handles API communication and caching
- `server.js`: Express server that handles translation API requests

## How It Works

1. User clicks the "Translate to Urdu" button on a chapter page
2. The TranslationButton component checks if the user is authenticated
3. If authenticated, it calls the TranslationService to translate the content
4. TranslationService checks for cached translations first
5. If not cached, it calls the API endpoint at `http://localhost:3001/api/translate`
6. The server handles the translation via OpenAI API
7. Results are cached and displayed to the user
8. User can toggle between original and translated content

## Caching

Translations are cached in localStorage with a 24-hour TTL to avoid repeated API calls for the same content.

## Error Handling

- Network errors are handled gracefully
- Translation failures show appropriate error messages
- Users are prompted to sign in if not authenticated