import { sendWhatsAppMessage } from "./whatsapp.js";
import { getLastMeal } from "./databaseHelpers.js";

export function calculateHealthScore(nutrition: any) {
    let score = 10;
    let reasons: string[] = [];

    if (nutrition.calories > 900) {
        score -= 2;
        reasons.push("High calories");
    }

    if (nutrition.fats > 40) {
        score -= 2;
        reasons.push("High fats");
    }

    if (nutrition.proteins < 20) {
        score -= 1;
        reasons.push("Low protein");
    }

    if (nutrition.carbs > 100) {
        score -= 1;
        reasons.push("High carbs");
    }

    if (score < 1) score = 1;

    return { score, reasons };
}

export async function handleHealthScore(user: string) {
    const lastMeal = await getLastMeal(user); // fetch from DB

    if (!lastMeal) {
        await sendWhatsAppMessage(user, "No meals found. Please track a meal first! 📊");
        return;
    }

    const result = calculateHealthScore(lastMeal);

    const message =
`Health Score 📊

Your meal scored: ${result.score}/10

Reasons:
${result.reasons.map(r => "⚠ " + r).join("\n")}

Suggestion:
Try adding vegetables or reducing fried items.`;

    await sendWhatsAppMessage(user, message);
}