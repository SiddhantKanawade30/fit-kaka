import { GoogleGenerativeAI } from "@google/generative-ai"; 
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateContent = async (prompt: string) => {
    try {
        // Use gemini-2.5-flash model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        if (!text) throw new Error("AI returned an empty response.");
        return text;
    } catch (error: any) {
        console.error("Gemini API Error:", error.message);
        if (error.status === 404) {
            console.error("Model not found. Try: gemini-1.5-flash or gemini-pro");
        }
        throw error;
    }
};

export const generateContentWithImage = async (prompt: string, imageData: Buffer, mimeType: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        // Validate image data
        if (!imageData || imageData.length === 0) {
            throw new Error("Invalid image data");
        }

        console.log(`[Image] Size: ${imageData.length} bytes, MIME: ${mimeType}`);

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageData.toString("base64"),
                    mimeType: mimeType || "image/jpeg",
                },
            },
        ]);
        
        const response = await result.response;
        const text = response.text();
        
        if (!text) throw new Error("AI returned an empty response.");
        return text;
    } catch (error: any) {
        console.error("Gemini Vision API Error:", error.message);
        console.error("Error Status:", error.status);
        throw error;
    }
};

/**
 * Alternative method using direct URL instead of base64
 */
export const generateContentWithImageUrl = async (prompt: string, imageUrl: string) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        console.log(`[Image URL] Processing: ${imageUrl}`);

        const result = await model.generateContent([
            prompt,
            {
                fileData: {
                    mimeType: "image/jpeg",
                    fileUri: imageUrl,
                },
            },
        ]);
        
        const response = await result.response;
        const text = response.text();
        
        if (!text) throw new Error("AI returned an empty response.");
        return text;
    } catch (error: any) {
        console.error("Gemini Vision API (URL) Error:", error.message);
        throw error;
    }
};