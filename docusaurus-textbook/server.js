// Server file for handling API requests for the Urdu Translation feature
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || '*'  // Use production frontend URL if available
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:4000'], // Common Docusaurus ports
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Load environment variables
require('dotenv').config();

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { content, targetLanguage, chapterId, userId } = req.body;

    if (!content || !targetLanguage || !chapterId) {
      return res.status(400).json({
        id: '',
        translatedContent: '',
        status: 'failed',
        error: 'Missing required fields: content, targetLanguage, chapterId'
      });
    }

    // Verify user is authenticated if needed
    if (!userId) {
      // We can check if user is authenticated here if needed
      // For now, we'll proceed assuming the caller has verified authentication
    }

    const start = Date.now();

    // Initialize OpenAI configuration
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    // Call the OpenAI API to translate the content
    const completion = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL_PATH || 'gpt-3.5-turbo',
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

    const response = {
      id: `${chapterId}-${Date.now()}`,
      translatedContent: translatedText,
      status: 'completed',
      processingTimeMs: processingTime,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Translation API error:', error);

    let errorMessage = 'Translation failed';
    if (error.response) {
      errorMessage = `API Error: ${error.response.status} - ${error.response.statusText}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({
      id: '',
      translatedContent: '',
      status: 'failed',
      error: errorMessage,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;