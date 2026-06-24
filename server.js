
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generativeai');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let conversationHistory = [];

app.get('/', (req, res) => {
  res.send('Fikury-SEEK Backend is running 🚀');
});

app.post('/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    conversationHistory = history || conversationHistory;
    conversationHistory.push({ role: 'user', parts: [{ text: message }] });
    conversationHistory.push({ role: 'model', parts: [{ text }] });

    res.json({ reply: text, history: conversationHistory });
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'AI service unavailable. Please try again later.' });
  }
});

app.get('/history', (req, res) => {
  res.json({ history: conversationHistory });
});

app.delete('/history', (req, res) => {
  conversationHistory = [];
  res.json({ message: 'History cleared' });
});

app.listen(port, () => {
  console.log(`🚀 Fikury-SEEK backend running on port ${port}`);
});
