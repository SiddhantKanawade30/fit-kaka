import { Router } from "express";
import type { Request, Response } from "express";
import { analyzeFood, analyzeFoodFromImage, handleHealthScore, handleDailySummary, sendWeeklyReport } from "../services/index.js";
import { parseAIJson, downloadWhatsAppImage, sendWhatsAppMessage, sendMoreButton, sendMainOptions, logger } from "../utils/index.js";
import { MealRepository } from "../database/index.js";
import axios from "axios";

const router = Router();

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
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    // Debug logging to understand the structure
    logger.debug("Full webhook body:", JSON.stringify(body, null, 2));
    
    if (!message) {
        logger.info("No message found in webhook");
        return res.sendStatus(200);
    }

    const from = message.from;
    const messageBody = message.text?.body || "";
    const imageId = message.image?.id;
    
    // Handle both button reply structures
    const buttonReply = message?.interactive?.button_reply?.id || 
                       message?.interactive?.list_reply?.id ||
                       message?.button?.payload;

    logger.info(`Message received from ${from}`);
    logger.debug(`Button reply ID: ${buttonReply}`);
    logger.debug(`Message body: ${messageBody}`);

    // For complex meals, send immediate acknowledgment
    const isComplexMeal = messageBody && messageBody.length > 50;

    try {
        let aiResponse: string | null = null;

        if (messageBody.toLowerCase() === "weekly report") {
            await sendWeeklyReport(from);
            return res.sendStatus(200);
        }

        if (buttonReply === "more_options") {
            logger.info("Sending main options");
            await sendMainOptions(from);
            return res.sendStatus(200);
        }

        if (buttonReply === "health_score") {
            logger.info("Handling health score");
            await handleHealthScore(from);   
            return res.sendStatus(200);
        }

        if (buttonReply === "custom_diet") {
            await sendWhatsAppMessage(from, "What is your goal?\n\n1️⃣ Weight Loss\n2️⃣ Muscle Gain\n3️⃣ Maintain Weight\n4️⃣ Healthy Eating");
            return res.sendStatus(200);
        }

        if (buttonReply === "set_goal") {
            await sendWhatsAppMessage(from, "Choose your fitness goal:\n\n1️⃣ Lose 5kg\n2️⃣ Gain Muscle\n3️⃣ Improve Nutrition");
            return res.sendStatus(200);
        }

        if (buttonReply === "daily_summary") {
            logger.info("Handling daily summary");
            await handleDailySummary(from);
            return res.sendStatus(200);
        }

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
                await MealRepository.create(from, nutrition);
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

        await sendMoreButton(from, reply);
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

export default router;