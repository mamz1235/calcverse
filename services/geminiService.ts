
export const getCalculatorInsight = async (
  calculatorName: string,
  inputs: Record<string, any>,
  result: string,
  language: string = 'en'
): Promise<string> => {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'zh': 'Chinese',
    'ko': 'Korean',
    'hi': 'Hindi',
    'ar': 'Arabic'
  };

  const targetLang = languageNames[language] || 'English';

  const prompt = `
    You are an expert consultant in ${calculatorName}.
    User Inputs: ${JSON.stringify(inputs)}
    Calculated Result: ${result}
    
    Provide a brief, 3-sentence expert insight or actionable advice based on this result. 
    Be professional, encouraging, and specific to the data.
    
    IMPORTANT: Provide the response in ${targetLang} language.
  `;

  try {
    const response = await fetch('/api/insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        model: 'gemini-3-flash-preview'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error:', errorData);
      return "Unable to generate insights at this moment.";
    }

    const data = await response.json();
    return data.text || "No insights available at this time.";
  } catch (error) {
    console.error("Gemini Service Error:", error);
    return "Unable to generate insights at this moment.";
  }
};

export interface Scenario {
  type: string;
  title: string;
  description: string;
  changes: string;
  outcome: string;
}

export const getScenarioSimulations = async (
  calculatorName: string,
  inputs: Record<string, any>,
  currentResult: string,
  language: string = 'en'
): Promise<Scenario[]> => {
  const prompt = `
    You are a financial and strategic planning expert using a ${calculatorName}.
    Current User Inputs: ${JSON.stringify(inputs)}
    Current Result: ${currentResult}

    Generate 3 distinct scenarios based on these inputs:
    1. Conservative (Low risk, pessimistic assumptions, safer bets)
    2. Moderate (Balanced approach, likely outcome)
    3. Aggressive (High risk, optimistic assumptions, max growth)

    For each scenario, briefly describe the strategy, the specific input changes (e.g. "Interest rate 7%"), and the predicted outcome difference.

    Respond in ${language} language.
    
    Return the response in this EXACT JSON structure:
    [
      {
        "type": "Conservative",
        "title": "Short Title",
        "description": "Brief explanation of the approach",
        "changes": "Specific input changes",
        "outcome": "Predicted impact on result"
      },
      { "type": "Moderate", ... },
      { "type": "Aggressive", ... }
    ]
  `;

  try {
    const response = await fetch('/api/insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        model: 'gemini-3-flash-preview',
        config: {
          responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const scenarios = JSON.parse(data.text);
    return scenarios;
  } catch (error) {
    console.error("Scenario Simulation Error:", error);
    return [];
  }
};
