import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

if (!process.env.GOOGLE_API_KEY) {
  console.error('❌ GOOGLE_API_KEY is missing!');
} else {
  console.log('✅ GOOGLE_API_KEY is set');
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
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    res.json({ result: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({
      error: error.message,
      stack: error.stack
    });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
