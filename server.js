import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: "healthy", message: "Fikury-backend engine is running cleanly." });
});

app.post('/api/chat', async (req, res) => {
    try {
        const userPrompt = req.body.message || req.body.prompt;

        if (!userPrompt) {
            return res.status(400).json({ error: "Message or prompt field parameter is missing." });
        }

        const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: "API key missing on server." });
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
        });

        return res.status(200).json({
            reply: response.text || "No response returned from Gemini."
        });

    } catch (error) {
        console.error("Chat failure detail:", error);
        // Expose the real error details so we can fix it immediately
        return res.status(500).json({ 
            error: "Gemini execution failed", 
            details: error.message || String(error) 
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
});
