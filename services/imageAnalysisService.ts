
export const analyzeMealPhoto = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64Image, mimeType }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      return "Unable to analyze image at this moment.";
    }

    const data = await response.json();
    return data.text || "Could not analyze image. Please ensure the food is clearly visible.";
  } catch (error) {
    console.error("Image analysis failed", error);
    return "Failed to analyze image. Please try again later.";
  }
};
