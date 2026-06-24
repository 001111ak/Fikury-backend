import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Initialize the client
// It will automatically pick up process.env.GEMINI_API_KEY if not passed explicitly
const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY 
});

async function getAIResponse(userPrompt) {
    try {
        const response = await ai.models.generateContent({
            // Use a current model, e.g., 'gemini-2.0-flash'
            model: 'gemini-2.0-flash', 
            contents: userPrompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

// Example usage within your Express route
// app.post('/chat', async (req, res) => {
//     const { prompt } = req.body;
//     const result = await getAIResponse(prompt);
//     res.json({ reply: result });
// });
