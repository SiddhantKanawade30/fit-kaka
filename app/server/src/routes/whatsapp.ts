import { Router } from "express";
import type { Request, Response } from "express";
import { analyzeFood, analyzeFoodFromImage, handleHealthScore, handleDailySummary, sendWeeklyReport, getOrCreateUser, updateUser } from "../services/index.js";
import { parseAIJson, downloadWhatsAppImage, sendWhatsAppMessage, sendMoreButton, sendMainOptions, sendGoalOptions, logger } from "../utils/index.js";
import { MealRepository } from "../database/index.js";
import type { GoalType, UserDocument } from "../schema/user.js";

const router = Router();

function parsePositiveInt(value: string): number | null {
    const parsed = Number.parseInt(value.trim(), 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}

function parseActivityLevel(input: string): "low" | "moderate" | "high" | null {
    const normalized = input.trim().toLowerCase();
    if (["low", "1", "sedentary", "light"].includes(normalized)) return "low";
    if (["moderate", "2", "medium", "active"].includes(normalized)) return "moderate";
    if (["high", "3", "very active"].includes(normalized)) return "high";
    return null;
}

function parseGoalValue(buttonReply: string | undefined, text: string): GoalType | null {
    if (buttonReply === "goal_weight_loss") return "weight_loss";
    if (buttonReply === "goal_muscle_gain") return "muscle_gain";
    if (buttonReply === "goal_maintain") return "maintain";

    const normalized = text.trim().toLowerCase();
    if (normalized.includes("weight") && normalized.includes("loss")) return "weight_loss";
    if (normalized.includes("muscle") && normalized.includes("gain")) return "muscle_gain";
    if (normalized.includes("maintain")) return "maintain";

    if (normalized === "1") return "weight_loss";
    if (normalized === "2") return "muscle_gain";
    if (normalized === "3") return "maintain";

    return null;
}

async function handleGoalSetup(user: UserDocument, messageBody: string, buttonReply?: string) {
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

            await updateUser(phone, { weight, goalSetupStep: "activity" });
            await sendWhatsAppMessage(
                phone,
                "What is your activity level? Reply with one option:\n1) low\n2) moderate\n3) high"
            );
            return;
        }

        case "activity": {
            const activityLevel = parseActivityLevel(messageBody);
            if (!activityLevel) {
                await sendWhatsAppMessage(
                    phone,
                    "Please choose a valid activity level:\n1) low\n2) moderate\n3) high"
                );
                return;
            }

            await updateUser(phone, { activityLevel, goalSetupStep: "goal" });
            await sendGoalOptions(phone, "Awesome. Now choose your primary goal:");
            return;
        }

        case "goal": {
            const goal = parseGoalValue(buttonReply, messageBody);
            if (!goal) {
                await sendGoalOptions(phone, "Please select one valid goal option:");
                return;
            }

            await updateUser(phone, {
                goal,
                goalProfileCompleted: true,
                goalSetupStep: null,
            });
            await sendWhatsAppMessage(phone, "Your goal profile has been saved. ✅");
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
            await handleGoalSetup(user, messageBody, buttonReply);
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
                await sendGoalOptions(from, "Choose your fitness goal:");
            }
            return res.sendStatus(200);
        }

        if (buttonReply === "goal_weight_loss" || buttonReply === "goal_muscle_gain" || buttonReply === "goal_maintain") {
            // Goal changes after profile completion; do not restart onboarding
            if (user.goalProfileCompleted) {
                const selectedGoal = parseGoalValue(buttonReply, "");
                if (selectedGoal) {
                    await updateUser(from, { goal: selectedGoal });
                    await sendWhatsAppMessage(from, "Goal updated successfully. 🎯");
                }
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