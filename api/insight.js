
import { GoogleGenAI } from "@google/genai";

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  try {
    const { prompt, model, config } = request.body;
    const client = new GoogleGenAI({ apiKey });
    
    const aiModel = model || 'gemini-3-flash-preview';
    
    const result = await client.models.generateContent({
      model: aiModel,
      contents: prompt,
      config: config
    });

    return response.status(200).json({ text: result.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return response.status(500).json({ error: 'Failed to generate insights' });
  }
}
