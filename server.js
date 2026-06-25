
// Endpoint to get AI response
app.post('/api/ai', async (req, res) => {
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // CORRECTED: Call generateContent directly on the 'ai' instance
    // Note: The new SDK uses 'ai.generateContent' directly
    const response = await ai.generateContent({
      model: 'gemini-2.0-flash', 
      contents: prompt,
    });
    
    // In this SDK, the text is accessed via response.text
    res.json({ result: response.text });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: error.message });
  }
});
