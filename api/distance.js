
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
    const { origin, destination } = request.body;
    const client = new GoogleGenAI({ apiKey });
    
    const prompt = `Calculate the driving distance between ${origin} and ${destination}. Return ONLY the number in kilometers. Do not include units or text. If not possible, return 0.`;

    const result = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.status(200).json({ text: result.text });
  } catch (error) {
    console.error('Distance API Error:', error);
    return response.status(500).json({ error: 'Failed to calculate distance' });
  }
}
