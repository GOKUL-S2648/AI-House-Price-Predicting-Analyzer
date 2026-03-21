import { House, SearchCriteria } from "./types";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

const callGroqAPI = async (messages: GroqMessage[], jsonMode = false): Promise<string> => {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 1024,
      ...(jsonMode && { response_format: { type: "json_object" } })
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data: GroqResponse = await response.json();
  return data.choices[0]?.message?.content || "";
};

export const getAffordabilityInsight = async (house: House, income: number) => {
  try {
    const messages: GroqMessage[] = [
      {
        role: "system",
        content: "You are a professional real estate advisor. Provide concise, helpful affordability insights."
      },
      {
        role: "user",
        content: `Evaluate affordability for: Income ₹${income}, Rent ₹${house.price}. Rule: 30% rent-to-income. House: ${house.title} in ${house.district}. Max 3 sentences. Professional tone.`
      }
    ];

    const response = await callGroqAPI(messages);
    return response || "Insight not available.";
  } catch (error) {
    return "Budget audit: Evaluate based on your monthly standard rule of 30%.";
  }
};

export const getPricePrediction = async (house: House) => {
  try {
    const messages: GroqMessage[] = [
      {
        role: "system",
        content: "You are a Real Estate Analyst. Return ONLY valid JSON with no additional text."
      },
      {
        role: "user",
        content: `Predict 2025 rent for ${house.title} in ${house.district}. Current: ₹${house.price}. Return ONLY JSON: {"predictedPrice": number, "reasoning": "string"}`
      }
    ];

    const response = await callGroqAPI(messages, true);
    const parsed = JSON.parse(response || "{}");
    return {
      predictedPrice: parsed.predictedPrice || house.price * 1.05,
      reasoning: parsed.reasoning || "Predicted based on regional growth patterns."
    };
  } catch (error) {
    return {
      predictedPrice: Math.round(house.price * 1.07),
      reasoning: "Market trends suggest a steady appreciation in this district."
    };
  }
};

export const getCategorizedSuggestions = async (criteria: SearchCriteria, houses: House[]) => {
  try {
    const categories = ['Pg', 'Apartment', 'Villa', 'Individual House', 'Studio'];
    const messages: GroqMessage[] = [
      {
        role: "system",
        content: "You are a real estate expert. Return ONLY valid JSON with no additional text."
      },
      {
        role: "user",
        content: `Expert real estate tips for Income ₹${criteria.income || 50000} in ${criteria.district || 'Market'}. Categories: ${categories.join(', ')}. Return ONLY JSON where keys are category names and values are arrays of 5 strings (15 words each).`
      }
    ];

    const response = await callGroqAPI(messages, true);
    const parsed = JSON.parse(response || "{}") as Record<string, string[]>;
    const result: Record<string, string[]> = {};
    categories.forEach(cat => {
      result[cat] = parsed[cat] || [`Check out available ${cat} options.`];
    });
    return result;
  } catch (error) {
    return {};
  }
};