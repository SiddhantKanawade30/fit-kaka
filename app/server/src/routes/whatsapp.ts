import { Router } from "express";
import type { Request, Response } from "express";
import { analyzeFood, analyzeFoodFromImage } from "../services/ai.service.js";
import { parseAIJson } from "../utils/parseAI.js";
import { saveMeal } from "../services/meal.service.js";
import logger from "../utils/logger.js";
import axios from "axios";

const router = Router();

/**
 * Downloads image from Twilio URL with authentication, following redirects
 */
async function downloadWhatsAppImage(imageId: string) {
    const token = process.env.WHATSAPP_TOKEN;

    const metaRes = await axios.get(
        `https://graph.facebook.com/v19.0/${imageId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const imageUrl = metaRes.data.url;

    const imageRes = await axios.get(imageUrl, {
        responseType: "arraybuffer",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return Buffer.from(imageRes.data);
}

/**
 * Webhook verification (GET request)
 */
router.get("/webhook/whatsapp", (req, res) => {
    const verify_token = process.env.VERIFY_TOKEN;

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === verify_token) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

/**
 * Handle incoming WhatsApp messages
 */
router.post("/webhook/whatsapp", async (req: Request, res: Response) => {
    const body = req.body;
    const message =
        req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
        return res.sendStatus(200);
    }

    const from = message.from;
    const messageBody = message.text?.body || "";
    const imageId = message.image?.id;

    logger.info(`Message received from ${from}`);

    // For complex meals, send immediate acknowledgment
    const isComplexMeal = messageBody && messageBody.length > 50;

    try {
        let aiResponse: string | null = null;

        // Handle image messages
        if (message.type === "image") {
            logger.info("Processing image message");

            const imageId = message.image.id;

            logger.info("Downloading image from WhatsApp");

            const imageBuffer = await downloadWhatsAppImage(imageId);

            logger.debug(`Image downloaded: ${imageBuffer.length} bytes`);

            if (imageBuffer.length === 0) {
                throw new Error("Downloaded image is empty");
            }

            aiResponse = await Promise.race([
                analyzeFoodFromImage(imageBuffer, "image/jpeg", messageBody),
                new Promise<string>((_, reject) =>
                    setTimeout(() => reject(new Error("AI analysis timeout")), 30000)
                )
            ]) as string;
        } else {
            // Handle text messages
            logger.info("Processing text message");

            // Dynamic timeout based on message complexity
            const timeoutMs = isComplexMeal ? 30000 : 20000; // 30s for complex, 20s for simple

            // Add timeout for AI analysis
            aiResponse = await Promise.race([
                analyzeFood(messageBody),
                new Promise<string>((_, reject) =>
                    setTimeout(() => reject(new Error("AI analysis timeout")), timeoutMs)
                )
            ]) as string;
        }

        if (!aiResponse) {
            throw new Error("AI Service returned no data");
        }

        let nutrition;
        try {
            nutrition = parseAIJson(aiResponse);
        } catch (parseError) {
            logger.error("Failed to parse AI response", parseError);
            throw new Error("Could not parse nutrition data");
        }
        logger.debug("Nutrition parsed", nutrition);

        // Save to database if valid data
        if (nutrition.food !== "Could not analyze food") {
            try {
                await saveMeal(from, nutrition);
                logger.info("Meal saved successfully");
            } catch (dbError) {
                logger.warn("Database save failed, continuing with response", dbError);
            }
        }

        // Format response
        const reply = `*Fit-Kaka Analysis* 🥗\n\n` +
            `🍴 *Food:* ${nutrition.food}\n` +
            `🔥 *Calories:* ${nutrition.calories} kcal\n` +
            `🥩 *Proteins:* ${nutrition.proteins}g\n` +
            `🍞 *Carbs:* ${nutrition.carbs}g\n` +
            `🧈 *Fats:* ${nutrition.fats}g`;

        await sendWhatsAppMessage(from, reply);
        res.sendStatus(200);

    } catch (error) {
        logger.error("WhatsApp webhook error", error);

        // Better error messages based on error type
        let errorMessage = "Sorry! I'm having trouble analyzing this. Please try again. 🧠📉";

        if (error instanceof Error && error.message === "AI analysis timeout") {
            errorMessage = isComplexMeal
                ? "This is a complex meal! Taking longer to analyze... Please try again in a moment. ⏳🍽️"
                : "Taking a bit longer than usual... Please try again! ⏳";
        }

        await sendWhatsAppMessage(from, errorMessage);
        res.sendStatus(200);
    }
});

async function sendWhatsAppMessage(to: string, text: string) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;

    await axios.post(
        `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
        {
            messaging_product: "whatsapp",
            to,
            type: "text",
            text: { body: text },
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export default router;