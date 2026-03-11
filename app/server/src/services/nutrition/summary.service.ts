import { MealRepository } from "../../database/index.js";
import { sendWhatsAppMessage } from "../../utils/index.js";

export async function handleDailySummary(user: string) {
  try {
    const todayMeals = await MealRepository.getTodayMeals(user);
    
    if (todayMeals.length === 0) {
      await sendWhatsAppMessage(user, "No meals logged today! Start tracking your nutrition! 📝");
      return;
    }

    const totals = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      proteins: acc.proteins + meal.proteins,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });

    const message = `📈 *Daily Nutrition Summary*\n\n` +
      `🍽️ Meals: ${todayMeals.length}\n` +
      `🔥 Total Calories: ${totals.calories} kcal\n` +
      `🥩 Total Proteins: ${totals.proteins}g\n` +
      `🍞 Total Carbs: ${totals.carbs}g\n` +
      `🧈 Total Fats: ${totals.fats}g\n\n` +
      `${totals.calories > 2000 ? '🎯 Great job fueling up!' : '💪 Keep tracking!'}`;

    await sendWhatsAppMessage(user, message);
  } catch (error) {
    console.error("Error handling daily summary:", error);
    await sendWhatsAppMessage(user, "Sorry! I couldn't fetch your daily summary. Please try again! 🧠📉");
  }
}

export async function sendWeeklyReport(user: string) {
  try {
    const weeklyMeals = await MealRepository.getWeeklyMeals(user);
    
    if (weeklyMeals.length === 0) {
      await sendWhatsAppMessage(user, "No meals found this week! Start tracking your nutrition! 📝");
      return;
    }

    const totals = weeklyMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      proteins: acc.proteins + meal.proteins,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats
    }), { calories: 0, proteins: 0, carbs: 0, fats: 0 });

    const avgDaily = {
      calories: Math.round(totals.calories / 7),
      proteins: Math.round(totals.proteins / 7 * 10) / 10,
      carbs: Math.round(totals.carbs / 7 * 10) / 10,
      fats: Math.round(totals.fats / 7 * 10) / 10
    };

    const message = `📊 *Weekly Nutrition Report*\n\n` +
      `🍽️ Total Meals: ${weeklyMeals.length}\n` +
      `📅 Daily Average:\n` +
      `🔥 ${avgDaily.calories} kcal\n` +
      `🥩 ${avgDaily.proteins}g proteins\n` +
      `🍞 ${avgDaily.carbs}g carbs\n` +
      `🧈 ${avgDaily.fats}g fats\n\n` +
      `🎯 Keep up the great work!`;

    await sendWhatsAppMessage(user, message);
  } catch (error) {
    console.error("Error sending weekly report:", error);
    await sendWhatsAppMessage(user, "Sorry! I couldn't generate your weekly report. Please try again! 🧠📉");
  }
}