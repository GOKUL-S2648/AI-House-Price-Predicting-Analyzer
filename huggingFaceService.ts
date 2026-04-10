
const HF_TOKEN = import.meta.env.VITE_HF_API_TOKEN;
const MODEL_URL = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224";

export interface HFAnalysisResult {
  label: string;
  score: number;
}

export const analyzeHouseImage = async (imageBlob: Blob | File): Promise<HFAnalysisResult[]> => {
  if (!HF_TOKEN || HF_TOKEN === 'your_hugging_face_token_here') {
    console.warn("Hugging Face Token missing or default. Skipping neural analysis.");
    return [];
  }

  try {
    const response = await fetch(MODEL_URL, {
      headers: { 
        "Authorization": `Bearer ${HF_TOKEN.trim()}`
      },
      method: "POST",
      body: imageBlob,
    });

    // If we hit a CORS or other non-ok response, log but don't crash the UI
    if (!response.ok) {
      const errorText = await response.text();
      console.warn("HF API Warning:", errorText);
      return [];
    }

    const result = await response.json();
    // Hugging face sometimes returns a different structure if still loading the model
    if (result.error && result.estimated_time) {
        console.warn("Model is still loading, please try again in a few seconds.");
        return [];
    }
    
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("HF Inference Network Error (Likely CORS):", error);
    return [];
  }
};

export const getTopLabel = (results: HFAnalysisResult[]): string => {
  if (!results || results.length === 0) return "";
  // Sort by score descending and return the top label
  return results.sort((a, b) => b.score - a.score)[0].label;
};
