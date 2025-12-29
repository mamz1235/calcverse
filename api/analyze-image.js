
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
    const { base64Image, mimeType } = request.body;
    const client = new GoogleGenAI({ apiKey });
    
    const result = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Analyze this food image. Estimate the approximate total calories and breakdown of macronutrients (Protein, Carbs, Fat) per serving. Provide a concise, friendly summary suitable for a nutrition tracking app. Format the output clearly."
          }
        ]
      }
    });

    return response.status(200).json({ text: result.text });
  } catch (error) {
    console.error('Image Analysis API Error:', error);
    return response.status(500).json({ error: 'Failed to analyze image' });
  }
}
