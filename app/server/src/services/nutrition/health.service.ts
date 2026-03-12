import { MealRepository } from "../../database/index.js";
import { sendWhatsAppMessage } from "../../utils/index.js";
import jwt from "jsonwebtoken";

const DASHBOARD_BASE_URL = process.env.DASHBOARD_BASE_URL?.trim() ?? "";

function buildDashboardLink(token: string): string | null {
  if (!DASHBOARD_BASE_URL) {
    return null;
  }

  let baseUrl: URL;
  try {
    baseUrl = new URL(DASHBOARD_BASE_URL);
  } catch {
    return null;
  }

  const directUrl = new URL("/direct", baseUrl);
  directUrl.searchParams.set("token", token);
  return directUrl.toString();
}

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
    const todayMeals = await MealRepository.getTodayMeals(user);

    // Use compact payload key `p` to keep token/link shorter.
    const dashboardToken = jwt.sign(
      { p: user },
      process.env.JWT_TOKEN || "fallback-secret-key",
      { expiresIn: "12h" }
    );
    const dashboardLink = buildDashboardLink(dashboardToken);
    
    if (!todayMeals || todayMeals.length === 0) {
      await sendWhatsAppMessage(
        user,
        "No meals found for today! 🍽️\n\nStart tracking your meals to get a health score!" +
          (dashboardLink ? `\n\n🔗 Dashboard:\n${dashboardLink}` : "")
      );
      return;
    }

    // Calculate totals for all meals today
    const totalNutrition = todayMeals.reduce((totals, meal) => ({
      calories: totals.calories + meal.calories,
      proteins: totals.proteins + meal.proteins,
      carbs: totals.carbs + meal.carbs,
      fats: totals.fats + meal.fats,
      foods: [...totals.foods, meal.food]
    }), {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
      foods: [] as string[]
    });

    const score = calculateHealthScore(
      totalNutrition.proteins,
      totalNutrition.carbs,
      totalNutrition.fats,
      totalNutrition.calories
    );

    const mealCount = todayMeals.length;
    const foodsList = totalNutrition.foods.slice(0, 3).join(', ');
    const moreFoods = totalNutrition.foods.length > 3 ? ` +${totalNutrition.foods.length - 3} more` : '';

    const message = `📊 *Today's Health Score*\n\n` +
      `🍽️ Meals analyzed: ${mealCount}\n` +
      `🍴 Foods: ${foodsList}${moreFoods}\n\n` +
      `⭐ Score: ${score}/10\n` +
      `🔥 Total Calories: ${totalNutrition.calories} kcal\n` +
      `🥩 Total Proteins: ${totalNutrition.proteins}g\n` +
      `🍞 Total Carbs: ${totalNutrition.carbs}g\n` +
      `🧈 Total Fats: ${totalNutrition.fats}g\n\n` +
      `${score >= 8 ? '🎉 Excellent nutrition today!' : score >= 6 ? '👍 Good day overall!' : '💪 Room for improvement!'}` +
      (dashboardLink ? `\n\n🔗 Dashboard:\n${dashboardLink}` : "");

    await sendWhatsAppMessage(user, message);
  } catch (error) {
    console.error("Error handling health score:", error);
    await sendWhatsAppMessage(user, "Sorry! I couldn't calculate the health score. Please try again! 🧠📉");
  }
}