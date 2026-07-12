const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  return new ChatGoogleGenerativeAI({
    model: 'gemini-flash-latest',
    maxOutputTokens: 8192,
    temperature: 0.2, // Low temperature for more objective, factual reporting
    apiKey: apiKey,
  });
};

module.exports = { getGeminiModel };
