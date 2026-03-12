import { GoogleGenerativeAI } from "@google/generative-ai"; 
import dotenv from "dotenv";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = "gemini-2.5-flash";

// Temporary, configurable cost meter (USD per 1M tokens)
const INPUT_COST_PER_MILLION = Number(process.env.GEMINI_INPUT_COST_PER_MILLION ?? "0");
const OUTPUT_COST_PER_MILLION = Number(process.env.GEMINI_OUTPUT_COST_PER_MILLION ?? "0");

type UsageMetadata = {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
};

export type GeminiUsageContext = {
    requestType:
        | "food_text_analysis"
        | "food_image_analysis"
        | "food_image_url_analysis"
        | "diet_generation"
        | "generic_text";
    inputChars?: number;
    imageBytes?: number;
    mimeType?: string;
};

function logGeminiUsage(
    kind: "text" | "image" | "image_url",
    usage?: UsageMetadata,
    startedAt?: number,
    context?: GeminiUsageContext
) {
    if (!usage) {
        console.warn(`[Gemini Usage] kind=${kind} requestType=${context?.requestType ?? "unknown"} usage metadata not available`);
        return;
    }

    const inputTokens = Number(usage.promptTokenCount ?? 0);
    const outputTokens = Number(usage.candidatesTokenCount ?? 0);
    const totalTokens = Number(usage.totalTokenCount ?? inputTokens + outputTokens);

    const inputCost = (inputTokens / 1_000_000) * INPUT_COST_PER_MILLION;
    const outputCost = (outputTokens / 1_000_000) * OUTPUT_COST_PER_MILLION;
    const estimatedCostUsd = inputCost + outputCost;
    const durationMs = startedAt ? Date.now() - startedAt : undefined;

    console.log("[Gemini Usage]", {
        kind,
        requestType: context?.requestType ?? "unknown",
        model: GEMINI_MODEL,
        inputTokens,
        outputTokens,
        totalTokens,
        estimatedCostUsd: Number(estimatedCostUsd.toFixed(8)),
        inputRatePerMillion: INPUT_COST_PER_MILLION,
        outputRatePerMillion: OUTPUT_COST_PER_MILLION,
        durationMs,
        inputChars: context?.inputChars,
        imageBytes: context?.imageBytes,
        mimeType: context?.mimeType,
        note: INPUT_COST_PER_MILLION === 0 && OUTPUT_COST_PER_MILLION === 0
            ? "Set GEMINI_INPUT_COST_PER_MILLION and GEMINI_OUTPUT_COST_PER_MILLION in .env for real cost estimate"
            : undefined,
    });
}

export const generateContent = async (prompt: string, context: GeminiUsageContext) => {
    try {
        const startedAt = Date.now();
        // Use gemini-2.5-flash model
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const usage = (response as any)?.usageMetadata as UsageMetadata | undefined;
        logGeminiUsage("text", usage, startedAt, context);
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

export const generateContentWithImage = async (
    prompt: string,
    imageData: Buffer,
    mimeType: string,
    context: GeminiUsageContext
) => {
    try {
        const startedAt = Date.now();
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        
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
        const usage = (response as any)?.usageMetadata as UsageMetadata | undefined;
        logGeminiUsage("image", usage, startedAt, {
            ...context,
            imageBytes: context.imageBytes ?? imageData.length,
            mimeType: context.mimeType ?? (mimeType || "image/jpeg"),
        });
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
export const generateContentWithImageUrl = async (
    prompt: string,
    imageUrl: string,
    context: GeminiUsageContext
) => {
    try {
        const startedAt = Date.now();
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
        
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
        const usage = (response as any)?.usageMetadata as UsageMetadata | undefined;
        logGeminiUsage("image_url", usage, startedAt, context);
        const text = response.text();
        
        if (!text) throw new Error("AI returned an empty response.");
        return text;
    } catch (error: any) {
        console.error("Gemini Vision API (URL) Error:", error.message);
        throw error;
    }
};