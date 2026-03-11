import { generateContent, generateContentWithImage, generateContentWithImageUrl } from "../config/gemini.js";

const NUTRITION_PROMPT = `
You are a certified nutrition expert. Analyze the food provided.
Return ONLY valid JSON with no markdown or extra text:
{
  "food": "name of the food",
  "serving_assumed": "amount shown or standard serving",
  "proteins": number (in grams),
  "carbs": number (in grams),
  "fats": number (in grams),
  "calories": number (in kcal)
}
`;

const IMAGE_PROMPT_BASE = `
You are a certified nutrition expert. Analyze the food in this image.
Return ONLY valid JSON with no markdown or extra text:
{
  "food": "name of the food",
  "serving_assumed": "amount shown or standard serving",
  "proteins": number (in grams),
  "carbs": number (in grams),
  "fats": number (in grams),
  "calories": number (in kcal)
}
`;

export const analyzeFood = async (text: string): Promise<string | null> => {
    try {
        const prompt = `${NUTRITION_PROMPT}\nAnalyze: "${text}"`;
        return await generateContent(prompt);
    } catch (error) {
        console.error("AI Service - Text Analysis Error:", error);
        return null;
    }
};

export const analyzeFoodFromImage = async (
    imageBuffer: Buffer, 
    mimeType: string, 
    weight?: string
): Promise<string | null> => {
    try {
        const weightContext = weight ? `The weight/quantity is: ${weight}.` : "";
        const prompt = `${IMAGE_PROMPT_BASE}\n${weightContext}`;
        return await generateContentWithImage(prompt, imageBuffer, mimeType);
    } catch (error) {
        console.error("AI Service - Image Analysis Error (base64):", error);
        return null;
    }
};

export const analyzeFoodFromImageUrl = async (
    imageUrl: string, 
    weight?: string
): Promise<string | null> => {
    try {
        const weightContext = weight ? `The weight/quantity is: ${weight}.` : "";
        const prompt = `${IMAGE_PROMPT_BASE}\n${weightContext}`;
        return await generateContentWithImageUrl(prompt, imageUrl);
    } catch (error) {
        console.error("AI Service - Image Analysis Error (URL):", error);
        return null;
    }
};