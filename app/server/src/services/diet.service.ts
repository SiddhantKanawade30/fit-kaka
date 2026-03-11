import { DietRepository } from "../database/index.js";
import { UserRepository } from "../database/index.js";
import { sendWhatsAppMessage } from "../utils/index.js";
import { analyzeFood } from "./ai.service.js";
import { UserDataService } from "./userData.service.js";

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
      // Base calorie calculation based on goal
      let baseCalories = 2000;
      if (goal === 'weight_loss') baseCalories = 1800;
      else if (goal === 'weight_gain') baseCalories = 2500;
      else if (goal === 'muscle_gain') baseCalories = 2800;

      // Generate diet based on vegetarian preference
      const mealOptions = this.getMealOptions(isVegetarian);

      const dietPlan: DietPlan = {
        breakfast: {
          foods: mealOptions.breakfast,
          calories: Math.round(baseCalories * 0.25),
          proteins: Math.round(baseCalories * 0.25 * 0.2 / 4),
          carbs: Math.round(baseCalories * 0.25 * 0.5 / 4),
          fats: Math.round(baseCalories * 0.25 * 0.3 / 9)
        },
        lunch: {
          foods: mealOptions.lunch,
          calories: Math.round(baseCalories * 0.35),
          proteins: Math.round(baseCalories * 0.35 * 0.25 / 4),
          carbs: Math.round(baseCalories * 0.35 * 0.45 / 4),
          fats: Math.round(baseCalories * 0.35 * 0.3 / 9)
        },
        evening_snack: {
          foods: mealOptions.snack,
          calories: Math.round(baseCalories * 0.1),
          proteins: Math.round(baseCalories * 0.1 * 0.15 / 4),
          carbs: Math.round(baseCalories * 0.1 * 0.6 / 4),
          fats: Math.round(baseCalories * 0.1 * 0.25 / 9)
        },
        dinner: {
          foods: mealOptions.dinner,
          calories: Math.round(baseCalories * 0.3),
          proteins: Math.round(baseCalories * 0.3 * 0.3 / 4),
          carbs: Math.round(baseCalories * 0.3 * 0.4 / 4),
          fats: Math.round(baseCalories * 0.3 * 0.3 / 9)
        },
        totalDailyCalories: baseCalories,
        totalDailyProteins: Math.round(baseCalories * 0.25 / 4),
        totalDailyCarbs: Math.round(baseCalories * 0.45 / 4),
        totalDailyFats: Math.round(baseCalories * 0.3 / 9)
      };

      return dietPlan;
    } catch (error) {
      console.error("Error generating diet plan:", error);
      throw error;
    }
  }

  static getMealOptions(isVegetarian: boolean) {
    if (isVegetarian) {
      return {
        breakfast: ["Oatmeal with fresh berries and almonds", "Greek yogurt with honey and walnuts", "Vegetable poha with peanuts", "Paneer bhurji with whole wheat toast and butter"],
        lunch: ["Brown rice with lentil dal and mixed vegetables", "Quinoa salad with roasted vegetables and chickpeas", "Whole wheat pasta with tomato sauce and vegetables", "Mixed vegetable curry with 2 whole wheat rotis"],
        snack: ["Fresh fruit salad with chia seeds", "Mixed nuts and dried fruits (30g)", "Vegetable soup with croutons", "Protein smoothie with spinach and banana"],
        dinner: ["Grilled vegetables with quinoa and olive oil", "Lentil soup with whole grain bread", "Stir-fried tofu with brown rice and vegetables", "Palak paneer with 2 whole wheat rotis"]
      };
    } else {
      return {
        breakfast: ["3 egg omelette with whole wheat toast and avocado", "Grilled chicken sausage with oatmeal and honey", "Greek yogurt with 2 boiled eggs", "Protein shake with eggs and banana"],
        lunch: ["150g grilled chicken breast with brown rice and vegetables", "Fish curry with whole wheat roti and salad", "Chicken salad with quinoa and olive oil dressing", "Mutton biryani (less oil) with cucumber salad"],
        snack: ["2 boiled eggs with black pepper", "Grilled chicken sandwich (whole wheat)", "Protein shake with peanut butter", "Greek yogurt with chicken strips"],
        dinner: ["200g grilled salmon with steamed vegetables", "Chicken stir-fry with brown rice and broccoli", "Mutton stew with vegetables and whole wheat bread", "Egg curry with whole wheat bread and salad"]
      };
    }
  }

  static async sendDietPlan(user: string, dietPlan: DietPlan) {
    const message = `*Your Personalized Diet Plan*\n\n` +
      `🌅 *Breakfast* (${dietPlan.breakfast.calories} cal)\n` +
      `${dietPlan.breakfast.foods.join(', ')}\n\n` +
      `☀️ *Lunch* (${dietPlan.lunch.calories} cal)\n` +
      `${dietPlan.lunch.foods.join(', ')}\n\n` +
      `🌤️ *Evening Snack* (${dietPlan.evening_snack.calories} cal)\n` +
      `${dietPlan.evening_snack.foods.join(', ')}\n\n` +
      `🌙 *Dinner* (${dietPlan.dinner.calories} cal)\n` +
      `${dietPlan.dinner.foods.join(', ')}\n\n` +
      `*Daily Totals*\n` +
      `🔥 Calories: ${dietPlan.totalDailyCalories} kcal\n` +
      `🥩 Protein: ${dietPlan.totalDailyProteins}g\n` +
      `🍞 Carbs: ${dietPlan.totalDailyCarbs}g\n` +
      `🧈 Fats: ${dietPlan.totalDailyFats}g\n\n` +
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
