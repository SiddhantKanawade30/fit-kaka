import { DietRepository } from "../database/index.js";
import { UserRepository } from "../database/index.js";
import { sendWhatsAppMessage } from "../utils/index.js";
import { UserDataService } from "./userData.service.js";
import { generateContent } from "../config/gemini.js";

interface DietPlan {
  breakfast: {
    foods: string[];
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  lunch: {
    foods: string[];
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  evening_snack: {
    foods: string[];
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  dinner: {
    foods: string[];
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  };
  totalDailyCalories: number;
  totalDailyProteins: number;
  totalDailyCarbs: number;
  totalDailyFats: number;
}

export class DietService {
  private static parseAndValidateDietPlan(raw: string): DietPlan {
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned) as Partial<DietPlan>;

    const normalizeMeal = (meal: any) => {
      const foods = Array.isArray(meal?.foods)
        ? meal.foods.map((f: unknown) => String(f)).filter(Boolean)
        : [];

      if (foods.length === 0) {
        throw new Error("Diet plan meal foods are missing");
      }

      return {
        foods,
        calories: Math.max(0, Math.round(Number(meal?.calories) || 0)),
        proteins: Math.max(0, Number(meal?.proteins) || 0),
        carbs: Math.max(0, Number(meal?.carbs) || 0),
        fats: Math.max(0, Number(meal?.fats) || 0),
      };
    };

    const breakfast = normalizeMeal(parsed.breakfast);
    const lunch = normalizeMeal(parsed.lunch);
    const evening_snack = normalizeMeal(parsed.evening_snack);
    const dinner = normalizeMeal(parsed.dinner);

    const totalDailyCalories =
      Math.max(0, Math.round(Number(parsed.totalDailyCalories) || 0)) ||
      Math.round(breakfast.calories + lunch.calories + evening_snack.calories + dinner.calories);

    const totalDailyProteins =
      Math.max(0, Number(parsed.totalDailyProteins) || 0) ||
      Number((breakfast.proteins + lunch.proteins + evening_snack.proteins + dinner.proteins).toFixed(1));

    const totalDailyCarbs =
      Math.max(0, Number(parsed.totalDailyCarbs) || 0) ||
      Number((breakfast.carbs + lunch.carbs + evening_snack.carbs + dinner.carbs).toFixed(1));

    const totalDailyFats =
      Math.max(0, Number(parsed.totalDailyFats) || 0) ||
      Number((breakfast.fats + lunch.fats + evening_snack.fats + dinner.fats).toFixed(1));

    return {
      breakfast,
      lunch,
      evening_snack,
      dinner,
      totalDailyCalories,
      totalDailyProteins,
      totalDailyCarbs,
      totalDailyFats,
    };
  }

  static async handleCustomDiet(user: string) {
    try {
      // Check if user exists in database
      const existingUser = await UserRepository.findByPhone(user);
      const existingDiet = await DietRepository.findByUser(user);

      if (existingDiet) {
        // User already has a diet plan, ask if they want to update
        await sendWhatsAppMessage(user, 
          "You already have a personalized diet plan! 🍽️\n\n" +
          "Would you like to:\n" +
          "1️⃣ View your current diet plan\n" +
          "2️⃣ Update your diet plan\n" +
          "3️⃣ Go back to main menu"
        );
        return 'diet_exists';
      }

      if (existingUser && existingUser.goalProfileCompleted) {
        // User exists with preferences, skip basic questions
        await sendWhatsAppMessage(user, 
          "Welcome back! Let's customize your diet plan 🎯\n\n" +
          "What's your primary goal?\n" +
          "1️⃣ Weight Loss\n" +
          "2️⃣ Weight Gain\n" +
          "3️⃣ Muscle Gain\n" +
          "4️⃣ Maintain Weight"
        );
        return 'ask_goal';
      } else {
        // New user, need basic info first
        await sendWhatsAppMessage(user, 
          "Welcome! Let's create your personalized diet plan 🎯\n\n" +
          "First, what's your primary goal?\n" +
          "1️⃣ Weight Loss\n" +
          "2️⃣ Weight Gain\n" +
          "3️⃣ Muscle Gain\n" +
          "4️⃣ Maintain Weight"
        );
        return 'ask_goal';
      }
    } catch (error) {
      console.error("Error in handleCustomDiet:", error);
      await sendWhatsAppMessage(user, "Sorry! I couldn't start the diet customization. Please try again! 🧠📉");
      return 'error';
    }
  }

  static async handleDietGoal(user: string, goal: string) {
    try {
      const goalMap: { [key: string]: string } = {
        '1': 'weight_loss',
        '2': 'weight_gain', 
        '3': 'muscle_gain',
        '4': 'maintain_weight',
        'weight_loss': 'weight_loss',
        'weight_gain': 'weight_gain',
        'muscle_gain': 'muscle_gain',
        'maintain_weight': 'maintain_weight'
      };

      const normalizedGoal = goalMap[goal.toLowerCase()];
      if (!normalizedGoal) {
        await sendWhatsAppMessage(user, "Please choose a valid option (1-4) or type the goal name:");
        return 'ask_goal';
      }

      // Special handling for weight loss - collect user data
      if (normalizedGoal === 'weight_loss') {
        await UserDataService.startWeightLossDataCollection(user);
        return 'weight_loss_data_collection';
      }

      // For other goals, proceed with vegetarian question
      await sendWhatsAppMessage(user, 
        "Great choice! 🎯\n\n" +
        "Are you vegetarian?\n" +
        "1️⃣ Yes (Vegetarian)\n" +
        "2️⃣ No (Non-vegetarian)"
      );
      return 'ask_vegetarian';
    } catch (error) {
      console.error("Error in handleDietGoal:", error);
      await sendWhatsAppMessage(user, "Sorry! I couldn't process your goal. Please try again! 🧠📉");
      return 'error';
    }
  }

  static async handleVegetarianStatus(userPhone: string, isVegetarian: string, goal: string) {
    try {
      const vegetarian = isVegetarian.toLowerCase() === '1' || 
                        isVegetarian.toLowerCase() === 'yes' || 
                        isVegetarian.toLowerCase() === 'vegetarian';

      const goalMap: { [key: string]: string } = {
        '1': 'weight_loss',
        '2': 'weight_gain', 
        '3': 'muscle_gain',
        '4': 'maintain_weight'
      };
      
      const normalizedGoal = goalMap[goal.toLowerCase()] || 'maintain_weight';

      await sendWhatsAppMessage(userPhone, 
        `Perfect! ${vegetarian ? '🥗' : '🍗'}\n\n` +
        "Let me create your personalized diet plan based on your preferences...\n" +
        "This will take a moment! ⏳"
      );

      // Generate diet plan
      const dietPlan = await this.generateDietPlan(userPhone, vegetarian, normalizedGoal);
      
      console.log("Generated diet plan:", JSON.stringify(dietPlan, null, 2));
      
      // Save diet plan
      await DietRepository.create({
        user: userPhone,
        goal: normalizedGoal,
        isVegetarian: vegetarian,
        preferences: {},
        dietPlan: dietPlan
      });

      // Send the diet plan
      await this.sendDietPlan(userPhone, dietPlan);
      
      return 'diet_created';
    } catch (error) {
      console.error("Error in handleVegetarianStatus:", error);
      await sendWhatsAppMessage(userPhone, "Sorry! I couldn't create your diet plan. Please try again! 🧠📉");
      return 'error';
    }
  }

  static async generateDietPlan(userPhone: string, isVegetarian: boolean, goal: string): Promise<DietPlan> {
    try {
      const user = await UserRepository.findByPhone(userPhone);

      const prompt = `You are an expert clinical nutritionist.
Create a realistic 1-day meal plan in strict JSON for this user.

User profile:
- Goal: ${goal}
- Preference: ${isVegetarian ? "vegetarian" : "non-vegetarian"}
- Age: ${user?.age ?? "unknown"}
- Height (cm): ${user?.height ?? "unknown"}
- Weight (kg): ${user?.weight ?? "unknown"}
- Daily calorie target (if available): ${user?.dailyCalories ?? "not set"}
- Daily protein target (if available): ${user?.dailyProteinIntake ?? "not set"}

Rules:
- Keep foods practical for Indian users.
- Return exactly 2-4 food items per meal.
- Keep calories and macros internally consistent and realistic.
- Output ONLY valid JSON (no markdown, no commentary).

JSON schema:
{
  "breakfast": {"foods": ["..."], "calories": number, "proteins": number, "carbs": number, "fats": number},
  "lunch": {"foods": ["..."], "calories": number, "proteins": number, "carbs": number, "fats": number},
  "evening_snack": {"foods": ["..."], "calories": number, "proteins": number, "carbs": number, "fats": number},
  "dinner": {"foods": ["..."], "calories": number, "proteins": number, "carbs": number, "fats": number},
  "totalDailyCalories": number,
  "totalDailyProteins": number,
  "totalDailyCarbs": number,
  "totalDailyFats": number
}`;

      const aiResponse = await generateContent(prompt, {
        requestType: "diet_generation",
        inputChars: prompt.length,
      });
      return this.parseAndValidateDietPlan(aiResponse);
    } catch (error) {
      console.error("Error generating diet plan:", error);
      throw new Error("Failed to generate diet plan from AI");
    }
  }

  static async sendDietPlan(user: string, dietPlan: unknown) {
    let safeDietPlan: DietPlan;
    try {
      safeDietPlan = this.parseAndValidateDietPlan(JSON.stringify(dietPlan));
    } catch {
      throw new Error("Invalid diet plan format");
    }

    const message = `*Your Personalized Diet Plan*\n\n` +
      `🌅 *Breakfast* (${safeDietPlan.breakfast.calories} cal)\n` +
      `${safeDietPlan.breakfast.foods.join(', ')}\n\n` +
      `☀️ *Lunch* (${safeDietPlan.lunch.calories} cal)\n` +
      `${safeDietPlan.lunch.foods.join(', ')}\n\n` +
      `🌤️ *Evening Snack* (${safeDietPlan.evening_snack.calories} cal)\n` +
      `${safeDietPlan.evening_snack.foods.join(', ')}\n\n` +
      `🌙 *Dinner* (${safeDietPlan.dinner.calories} cal)\n` +
      `${safeDietPlan.dinner.foods.join(', ')}\n\n` +
      `*Daily Totals*\n` +
      `🔥 Calories: ${safeDietPlan.totalDailyCalories} kcal\n` +
      `🥩 Protein: ${safeDietPlan.totalDailyProteins}g\n` +
      `🍞 Carbs: ${safeDietPlan.totalDailyCarbs}g\n` +
      `🧈 Fats: ${safeDietPlan.totalDailyFats}g\n\n` +
      `Your diet plan has been saved successfully! 🎯`;

    await sendWhatsAppMessage(user, message);
  }

  static async handleExistingDiet(user: string, choice: string) {
    try {
      if (choice === '1' || choice.toLowerCase().includes('view')) {
        const diet = await DietRepository.findByUser(user);
        if (diet) {
          await this.sendDietPlan(user, diet.dietPlan);
        } else {
          await sendWhatsAppMessage(user, "No diet plan found. Let's create one for you!");
          return await this.handleCustomDiet(user);
        }
      } else if (choice === '2' || choice.toLowerCase().includes('update')) {
        await DietRepository.deleteByUser(user);
        await sendWhatsAppMessage(user, 
          "Let's create your updated diet plan! 🎯\n\n" +
          "What's your new goal?\n" +
          "1️⃣ Weight Loss\n" +
          "2️⃣ Weight Gain\n" +
          "3️⃣ Muscle Gain\n" +
          "4️⃣ Maintain Weight"
        );
        return 'ask_goal';
      } else {
        // Go back to main menu
        const { sendMainOptions } = await import("../utils/index.js");
        await sendMainOptions(user);
      }
    } catch (error) {
      console.error("Error in handleExistingDiet:", error);
      await sendWhatsAppMessage(user, "Sorry! I couldn't process your request. Please try again! 🧠📉");
    }
  }
}

