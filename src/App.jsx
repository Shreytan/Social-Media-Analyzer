const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

const makeAPIRequest = async (prompt, schema) => {
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Invalid response structure from API");
  }

  return JSON.parse(text);
};

export const analyzePost = async (text) => {
  const prompt = `Analyze the following social media post text. Provide a JSON object with your analysis.
    Post: "${text}"
    Provide an estimated engagement score out of 10 (float), the overall sentiment (one word: Positive, Neutral, or Negative), and an array of 4 short, actionable suggestions for improvement.`;

  const schema = {
    type: "OBJECT",
    properties: {
      engagementScore: { type: "NUMBER" },
      sentiment: { type: "STRING" },
      suggestions: { type: "ARRAY", items: { type: "STRING" } },
    },
    required: ["engagementScore", "sentiment", "suggestions"]
  };

  return makeAPIRequest(prompt, schema);
};

export const rewritePost = async (text) => {
  const prompt = `Rewrite the following social media post in three different tones: Casual, Professional, and Excited. Provide the result as a JSON object.
    Original Post: "${text}"`;

  const schema = {
    type: "OBJECT",
    properties: {
      casual: { type: "STRING" },
      professional: { type: "STRING" },
      excited: { type: "STRING" },
    },
    required: ["casual", "professional", "excited"]
  };

  return makeAPIRequest(prompt, schema);
};
