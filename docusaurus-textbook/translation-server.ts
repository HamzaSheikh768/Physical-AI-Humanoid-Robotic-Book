import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { content, targetLanguage, chapterId, userId } = req.body;

    if (!content || !targetLanguage) {
      return res.status(400).json({
        id: '',
        translatedContent: '',
        status: 'failed',
        error: 'Missing required fields: content or targetLanguage'
      });
    }

    let translatedText = content; // Default to original content

    // Only use OpenAI if API key is provided, otherwise use mock translation
    if (process.env.OPENAI_API_KEY) {
      // Initialize OpenAI client only when API key is available
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });

      // Construct the translation prompt
      const prompt = `Translate the following text to ${targetLanguage}.
      Return only the translated text without any additional comments or explanations:

      ${content}`;

      // Generate translation using OpenAI
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo', // or 'gpt-4' if you prefer
      });

      translatedText = completion.choices[0]?.message?.content?.trim() || content;
    } else {
      // Use mock translation service
      translatedText = await mockTranslate(content, targetLanguage);
    }

    res.json({
      id: `${chapterId || 'unknown'}-${Date.now()}`,
      translatedContent: translatedText,
      status: 'completed',
      processingTimeMs: Date.now() - Date.now() // This is just a placeholder - in real implementation you'd track actual time
    });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({
      id: '',
      translatedContent: '',
      status: 'failed',
      error: 'Translation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mock translation function for testing without API key
async function mockTranslate(content: string, targetLanguage: string): Promise<string> {
  // This is a simple mock translation - in a real implementation you might use
  // a free translation service or a more sophisticated mock
  const translations: Record<string, string> = {
    'en': content, // English stays the same
    'ur': `[Mock Urdu translation of: "${content}"]`,
    'es': `[Mock Spanish translation of: "${content}"]`,
    'fr': `[Mock French translation of: "${content}"]`,
    'de': `[Mock German translation of: "${content}"]`,
    'ja': `[Mock Japanese translation of: "${content}"]`,
    'zh': `[Mock Chinese translation of: "${content}"]`,
  };

  return translations[targetLanguage.toLowerCase()] || `[Mock ${targetLanguage} translation of: "${content}"]`;
}

app.listen(port, () => {
  console.log(`Translation proxy server running at http://localhost:${port}`);
});