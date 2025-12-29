
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
    const { startPoint, endPoint } = request.body;
    const client = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Calculate the slope between "${startPoint}" and "${endPoint}".
      I need the elevation of both points and the distance between them.
      Return ONLY a JSON object with this structure (no markdown, no text):
      {
        "startElevationMeters": number,
        "endElevationMeters": number,
        "distanceMeters": number
      }
      Estimate if exact data is unavailable.
    `;

    const result = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.status(200).json({ text: result.text });
  } catch (error) {
    console.error('Slope API Error:', error);
    return response.status(500).json({ error: 'Failed to calculate slope' });
  }
}
