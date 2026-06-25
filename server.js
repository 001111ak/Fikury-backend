
import 'dotenv/config'; // Loads your environment variables automatically
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize AI with API key from environment
// Make sure GOOGLE_API_KEY is set in your Render Environment settings
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// Endpoint to get AI response
app.post('/api/ai', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // CORRECTED: Call generateContent directly on the 'ai' instance
    const response = await ai.generateContent({
      model: 'gemini-2.0-flash', 
      contents: prompt,
    });
    
    res.json({ result: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
