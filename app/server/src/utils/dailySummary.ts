import { sendWhatsAppMessage } from "./whatsapp.js";
import { getTodayMeals } from "./databaseHelpers.js";

export async function handleDailySummary(user: string) {

    const meals = await getTodayMeals(user);

    if (meals.length === 0) {
        await sendWhatsAppMessage(user, "No meals tracked today. Start logging your meals! 📊");
        return;
    }

    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    meals.forEach(m => {
        calories += m.calories;
        protein += m.proteins;
        carbs += m.carbs;
        fats += m.fats;
    });

    const message =
`Today's Nutrition Summary 📊

Calories: ${calories} kcal
Protein: ${protein}g
Carbs: ${carbs}g
Fats: ${fats}g

Meals tracked: ${meals.length} 🍽️`;

    await sendWhatsAppMessage(user, message);
}