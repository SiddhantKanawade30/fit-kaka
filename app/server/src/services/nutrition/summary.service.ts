import { MealRepository } from "../../database/index.js";
import { UserRepository } from "../../database/index.js";
import { sendWhatsAppMessage } from "../../utils/index.js";
import jwt from "jsonwebtoken";

const DASHBOARD_BASE_URL = process.env.DASHBOARD_BASE_URL ?? "http://localhost:3000";
const SUMMARY_TIMEZONE = process.env.SUMMARY_TIMEZONE ?? "Asia/Kolkata";

function getDateKeyInTimezone(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone }).format(date);
}

export async function handleDailySummary(user: string) {
  try {
    // Fetch broader window and then filter by user's summary timezone date key
    const recentMeals = await MealRepository.findByUser(user, 200);
    const todayKey = getDateKeyInTimezone(new Date(), SUMMARY_TIMEZONE);
    const todayMeals = recentMeals.filter((meal: any) =>
      getDateKeyInTimezone(new Date(meal.createdAt), SUMMARY_TIMEZONE) === todayKey
    );
    
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

    const roundedTotals = {
      calories: Math.round(totals.calories),
      proteins: Math.round(totals.proteins * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fats: Math.round(totals.fats * 10) / 10,
    };

    const profile = await UserRepository.findByPhone(user);

    const progressLines: string[] = [];
    if (profile?.dailyCalories) {
      const pct = Math.min(999, Math.round((roundedTotals.calories / profile.dailyCalories) * 100));
      progressLines.push(`🔥 Calories: ${roundedTotals.calories}/${profile.dailyCalories} (${pct}%)`);
    }
    if (profile?.dailyProteinIntake) {
      const pct = Math.min(999, Math.round((roundedTotals.proteins / profile.dailyProteinIntake) * 100));
      progressLines.push(`🥩 Protein: ${roundedTotals.proteins}/${profile.dailyProteinIntake}g (${pct}%)`);
    }
    if (profile?.dailyCarbs) {
      const pct = Math.min(999, Math.round((roundedTotals.carbs / profile.dailyCarbs) * 100));
      progressLines.push(`🍞 Carbs: ${roundedTotals.carbs}/${profile.dailyCarbs}g (${pct}%)`);
    }
    if (profile?.dailyFats) {
      const pct = Math.min(999, Math.round((roundedTotals.fats / profile.dailyFats) * 100));
      progressLines.push(`🧈 Fats: ${roundedTotals.fats}/${profile.dailyFats}g (${pct}%)`);
    }

    const dashboardToken = jwt.sign(
      { phone: user, purpose: "dashboard_link" },
      process.env.JWT_TOKEN || "fallback-secret-key",
      { expiresIn: "30m" }
    );
    const dashboardLink = `${DASHBOARD_BASE_URL}/direct?token=${encodeURIComponent(dashboardToken)}&phone=${encodeURIComponent(user)}`;

    const message = `📈 *Daily Nutrition Summary*\n\n` +
      `🗓 Date: ${todayKey} (${SUMMARY_TIMEZONE})\n` +
      `🍽️ Meals Logged: ${todayMeals.length}\n` +
      `🔥 Total Calories: ${roundedTotals.calories} kcal\n` +
      `🥩 Total Proteins: ${roundedTotals.proteins}g\n` +
      `🍞 Total Carbs: ${roundedTotals.carbs}g\n` +
      `🧈 Total Fats: ${roundedTotals.fats}g\n\n` +
      `${progressLines.length > 0 ? `🎯 *Goal Progress*\n${progressLines.join("\n")}\n\n` : ""}` +
      `🔗 *View your dashboard*\n${dashboardLink}`;

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