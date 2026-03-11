import { MealRepository } from "../../database/index.js";
import { sendWhatsAppMessage } from "../../utils/index.js";

export function calculateHealthScore(proteins: number, carbs: number, fats: number, calories: number): number {
  // Simple health scoring algorithm
  let score = 10;

  // Deduct points for excessive calories
  if (calories > 800) score -= 2;
  else if (calories > 600) score -= 1;

  // Bonus for balanced macros
  const proteinRatio = proteins * 4 / calories;
  const carbRatio = carbs * 4 / calories;
  const fatRatio = fats * 9 / calories;

  if (proteinRatio >= 0.2 && proteinRatio <= 0.4) score += 1;
  if (carbRatio >= 0.4 && carbRatio <= 0.6) score += 1;
  if (fatRatio >= 0.2 && fatRatio <= 0.35) score += 1;

  return Math.min(10, Math.max(1, score));
}

export async function handleHealthScore(user: string) {
  try {
    const lastMeal = await MealRepository.getLastMeal(user);
    
    if (!lastMeal) {
      await sendWhatsAppMessage(user, "No meals found to analyze! 🍽️");
      return;
    }

    const score = calculateHealthScore(
      lastMeal.proteins,
      lastMeal.carbs,
      lastMeal.fats,
      lastMeal.calories
    );

    const message = `📊 *Health Score for ${lastMeal.food}*\n\n` +
      `⭐ Score: ${score}/10\n` +
      `🔥 Calories: ${lastMeal.calories} kcal\n` +
      `🥩 Proteins: ${lastMeal.proteins}g\n` +
      `🍞 Carbs: ${lastMeal.carbs}g\n` +
      `🧈 Fats: ${lastMeal.fats}g\n\n` +
      `${score >= 8 ? '🎉 Excellent choice!' : score >= 6 ? '👍 Good meal!' : '💪 Could be better!'}`;

    await sendWhatsAppMessage(user, message);
  } catch (error) {
    console.error("Error handling health score:", error);
    await sendWhatsAppMessage(user, "Sorry! I couldn't calculate the health score. Please try again! 🧠📉");
  }
}