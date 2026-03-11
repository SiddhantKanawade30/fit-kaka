import { Router } from "express";
import type { Request, Response } from "express";
import { analyzeFood, analyzeFoodFromImage, handleHealthScore, handleDailySummary, sendWeeklyReport, getOrCreateUser, updateUser } from "../services/index.js";
import { parseAIJson, downloadWhatsAppImage, sendWhatsAppMessage, sendMoreButton, sendMainOptions, logger } from "../utils/index.js";
import { MealRepository } from "../database/index.js";
import type { UserDocument } from "../schema/user.js";

const router = Router();

function parsePositiveInt(value: string): number | null {
    const parsed = Number.parseInt(value.trim(), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}

async function handleGoalSetup(user: UserDocument, messageBody: string) {
    const phone = user.phone;
    const currentStep = user.goalSetupStep;

    if (!currentStep) {
        return;
    }

    switch (currentStep) {
        case "age": {
            const age = parsePositiveInt(messageBody);
            if (!age || age < 10 || age > 120) {
                await sendWhatsAppMessage(phone, "Please enter a valid age in years (example: 25).");
                return;
            }

            await updateUser(phone, { age, goalSetupStep: "height" });
            await sendWhatsAppMessage(phone, "Great! What is your height in cm?");
            return;
        }

        case "height": {
            const height = parsePositiveInt(messageBody);
            if (!height || height < 90 || height > 250) {
                await sendWhatsAppMessage(phone, "Please enter a valid height in cm (example: 170).");
                return;
            }

            await updateUser(phone, { height, goalSetupStep: "weight" });
            await sendWhatsAppMessage(phone, "Got it. What is your current weight in kg?");
            return;
        }

        case "weight": {
            const weight = parsePositiveInt(messageBody);
            if (!weight || weight < 20 || weight > 400) {
                await sendWhatsAppMessage(phone, "Please enter a valid weight in kg (example: 70).");
                return;
            }

            await updateUser(phone, { weight, goalSetupStep: "macros" });
            await sendWhatsAppMessage(
                phone,
                "Now enter your daily nutrition goals, one per line:\n\nProtein (g)\nCalories (kcal)\nCarbs (g)\nFats (g)\n\nExample:\n120\n2000\n250\n70"
            );
            return;
        }

        case "macros": {
            const lines = messageBody.trim().split(/\n/).filter(line => line.trim().length > 0);
            const values = lines.map(v => Number.parseInt(v.trim(), 10));
            
            if (values.length !== 4 || values.some(v => !Number.isFinite(v) || v <= 0)) {
                await sendWhatsAppMessage(
                    phone,
                    "Please enter 4 valid numbers, one per line:\n\nProtein (g)\nCalories (kcal)\nCarbs (g)\nFats (g)\n\nExample:\n120\n2000\n250\n70"
                );
                return;
            }

            const [protein, calories, carbs, fats] = values;

            if (protein < 20 || protein > 500) {
                await sendWhatsAppMessage(phone, "Protein should be between 20-500g. Please try again.");
                return;
            }
            if (calories < 500 || calories > 10000) {
                await sendWhatsAppMessage(phone, "Calories should be between 500-10000 kcal. Please try again.");
                return;
            }
            if (carbs < 20 || carbs > 1000) {
                await sendWhatsAppMessage(phone, "Carbs should be between 20-1000g. Please try again.");
                return;
            }
            if (fats < 10 || fats > 500) {
                await sendWhatsAppMessage(phone, "Fats should be between 10-500g. Please try again.");
                return;
            }

            await updateUser(phone, {
                dailyProteinIntake: protein,
                dailyCalories: calories,
                dailyCarbs: carbs,
                dailyFats: fats,
                goalProfileCompleted: true,
                goalSetupStep: null,
            });
            await sendWhatsAppMessage(phone, "Goals are set ✅");
            return;
        }
    }
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
    const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    // Debug logging to understand the structure
    logger.debug("Full webhook body:", JSON.stringify(body, null, 2));
    
    if (!message) {
        logger.info("No message found in webhook");
        return res.sendStatus(200);
    }

    const from = message.from;
    const messageBody = message.text?.body || "";
    
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
        const user = await getOrCreateUser(from);

        // Resume onboarding if already active
        if (user.goalSetupStep) {
            await handleGoalSetup(user, messageBody);
            return res.sendStatus(200);
        }

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
            if (!user.goalProfileCompleted) {
                await updateUser(from, { goalSetupStep: "age" });
                await sendWhatsAppMessage(from, "Let's set up your profile. How old are you?");
            } else {
                await sendWhatsAppMessage(from, "Your goals are already set.");
            }
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