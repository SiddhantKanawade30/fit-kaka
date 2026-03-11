import { Meal } from "../schema/meal.js";
import mongoose from "mongoose";

export async function getLastMeal(user: string) {
    try {
        const meal = await Meal.findOne({ user }).sort({ createdAt: -1 });
        return meal;
    } catch (error) {
        console.error("Error getting last meal:", error);
        return null;
    }
}

export async function getTodayMeals(user: string) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const meals = await Meal.find({ 
            user,
            createdAt: { $gte: today }
        }).sort({ createdAt: -1 });
        
        return meals;
    } catch (error) {
        console.error("Error getting today's meals:", error);
        return [];
    }
}

export async function getWeeklyMeals(user: string) {
    try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7); // 7 days ago
        
        const meals = await Meal.find({ 
            user,
            createdAt: { $gte: weekAgo }
        }).sort({ createdAt: -1 });
        
        return meals;
    } catch (error) {
        console.error("Error getting weekly meals:", error);
        return [];
    }
}

export async function sendWeeklyReport(user: string) {
    const meals = await getWeeklyMeals(user);
    
    if (meals.length === 0) {
        await sendWhatsAppMessage(user, "No meals found in the past week. Start tracking your meals! 📊");
        return;
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    
    meals.forEach(meal => {
        totalCalories += meal.calories;
        totalProtein += meal.proteins;
        totalCarbs += meal.carbs;
        totalFats += meal.fats;
    });

    const avgCalories = Math.round(totalCalories / meals.length);
    const avgProtein = Math.round(totalProtein / meals.length);
    
    const message = `*Weekly Nutrition Report* 📊

🗓 *Period:* Last 7 days
🍽 *Meals Tracked:* ${meals.length}

🔥 *Total Calories:* ${totalCalories} kcal
📈 *Daily Average:* ${avgCalories} kcal

🥩 *Total Protein:* ${totalProtein}g
📊 *Daily Average:* ${avgProtein}g

🍞 *Total Carbs:* ${totalCarbs}g
🧈 *Total Fats:* ${totalFats}g

${avgCalories > 2500 ? '⚠️ High calorie intake detected!' : '✅ Calorie intake looks good!'}
${avgProtein < 30 ? '⚠️ Consider increasing protein intake!' : '✅ Protein intake looks good!'}

Keep up the great work! 💪`;

    await sendWhatsAppMessage(user, message);
}

// Import sendWhatsAppMessage at the end to avoid circular dependency
import { sendWhatsAppMessage } from "./whatsapp.js";