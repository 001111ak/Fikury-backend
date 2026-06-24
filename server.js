import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({});

async function getAIResponse(userPrompt) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: userPrompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
