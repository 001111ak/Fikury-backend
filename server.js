import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// 1. Enable Cross-Origin Resource Sharing
app.use(cors());

// 2. Enable JSON body parsing
app.use(express.json());

// Initialize Google Gen AI client (reads GEMINI_API_KEY from environment)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 3. Base health check route
app.get('/', (req, res) => {
    res.json({ status: "healthy", message: "Fikury-backend processing engine is running cleanly." });
});

// 4. Main AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        // Accepts either 'message' (from UI) or 'prompt' (from ReqBin/Postman)
        const userPrompt = req.body.message || req.body.prompt;

        // Validation guard rail
        if (!userPrompt) {
            return res.status(400).json({ error: "Message or prompt field parameter is missing." });
        }

        console.log(`Received user payload: "${userPrompt}"`);

        // Check if API key is set
        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY environment variable is missing.");
            return res.status(500).json({ error: "Gemini API key missing on backend server." });
        }

        // --- GOOGLE GEMINI AI INTEGRATION ---
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
        });

        const automatedReply = response.text || "No response returned from Gemini.";

        // Send response payload back cleanly
        return res.status(200).json({
            reply: automatedReply
        });

    } catch (error) {
        console.error("Internal processing fault inside chat pipeline:", error);
        return res.status(500).json({ error: "Internal core engine operational route failure." });
    }
});

// Bind listener port
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Fikury Core Application Node Live Matrix Running on Port: ${PORT}`);
    console.log(`=============================================`);
});
