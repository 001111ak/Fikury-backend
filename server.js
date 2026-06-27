import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Check API key at startup
if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_API_KEY is missing!');
}

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Fikury Backend is running' });
});

app.post('/api/ai', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Try with gemini-1.5-flash (more stable) as fallback
    let model = 'gemini-1.5-flash';
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    res.json({ result: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    // Send back detailed error for debugging
    res.status(500).json({ 
      error: error.message,
      details: error.stack,
      code: error.code || 'unknown'
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
