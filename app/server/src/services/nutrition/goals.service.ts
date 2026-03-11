import { MealRepository } from "../../database/index.js";
import { UserRepository } from "../../database/index.js";
import { GoalAchievementRepository } from "../../database/index.js";
import { sendWhatsAppMessage } from "../../utils/index.js";

export interface GoalStatus {
  proteinReached: boolean;
  caloriesReached: boolean;
  carbsReached: boolean;
  fatsReached: boolean;
  totalProtein: number;
  totalCalories: number;
  totalCarbs: number;
  totalFats: number;
}

export async function checkAndAlertGoals(phone: string): Promise<void> {
  try {
    console.log(`[Goals] Checking goals for user: ${phone}`);
    
    const user = await UserRepository.findByPhone(phone);
    
    if (!user) {
      console.log(`[Goals] User not found: ${phone}`);
      return;
    }
    
    if (!user.goalProfileCompleted) {
      console.log(`[Goals] User has not completed goal setup: ${phone}`);
      return;
    }

    console.log(`[Goals] User goals: protein=${user.dailyProteinIntake}, calories=${user.dailyCalories}, carbs=${user.dailyCarbs}, fats=${user.dailyFats}`);

    const todayMeals = await MealRepository.getTodayMeals(phone);
    
    console.log(`[Goals] Found ${todayMeals.length} meals today for ${phone}`);
    
    if (todayMeals.length === 0) {
      console.log(`[Goals] No meals found, skipping alert`);
      return;
    }

    const totals = todayMeals.reduce(
      (acc, meal) => ({
        protein: acc.protein + meal.proteins,
        calories: acc.calories + meal.calories,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { protein: 0, calories: 0, carbs: 0, fats: 0 }
    );

    console.log(`[Goals] Today totals: protein=${totals.protein}, calories=${totals.calories}, carbs=${totals.carbs}, fats=${totals.fats}`);

    const alerts: string[] = [];
    const today = new Date();

    // Check each goal and create achievement records for newly reached goals
    if (user.dailyProteinIntake && totals.protein >= user.dailyProteinIntake) {
      console.log(`[Goals] Protein goal reached: ${totals.protein} >= ${user.dailyProteinIntake}`);
      
      const existingAchievement = await GoalAchievementRepository.findByUserAndGoal(phone, 'daily_proteins', today);
      
      if (!existingAchievement) {
        // First time achieving this goal today
        await GoalAchievementRepository.create({
          user: phone,
          goalType: 'daily_proteins',
          achievedDate: today,
          value: totals.protein,
          target: user.dailyProteinIntake,
          notified: false
        });
        alerts.push(`🥩 Protein goal reached! (${totals.protein}g / ${user.dailyProteinIntake}g)`);
      }
    }

    if (user.dailyCalories && totals.calories >= user.dailyCalories) {
      console.log(`[Goals] Calories goal reached: ${totals.calories} >= ${user.dailyCalories}`);
      
      const existingAchievement = await GoalAchievementRepository.findByUserAndGoal(phone, 'daily_calories', today);
      
      if (!existingAchievement) {
        // First time achieving this goal today
        await GoalAchievementRepository.create({
          user: phone,
          goalType: 'daily_calories',
          achievedDate: today,
          value: totals.calories,
          target: user.dailyCalories,
          notified: false
        });
        alerts.push(`🔥 Calories goal reached! (${totals.calories} / ${user.dailyCalories} kcal)`);
      }
    }

    if (user.dailyCarbs && totals.carbs >= user.dailyCarbs) {
      console.log(`[Goals] Carbs goal reached: ${totals.carbs} >= ${user.dailyCarbs}`);
      
      const existingAchievement = await GoalAchievementRepository.findByUserAndGoal(phone, 'daily_carbs', today);
      
      if (!existingAchievement) {
        // First time achieving this goal today
        await GoalAchievementRepository.create({
          user: phone,
          goalType: 'daily_carbs',
          achievedDate: today,
          value: totals.carbs,
          target: user.dailyCarbs,
          notified: false
        });
        alerts.push(`🍞 Carbs goal reached! (${totals.carbs}g / ${user.dailyCarbs}g)`);
      }
    }

    if (user.dailyFats && totals.fats >= user.dailyFats) {
      console.log(`[Goals] Fats goal reached: ${totals.fats} >= ${user.dailyFats}`);
      
      const existingAchievement = await GoalAchievementRepository.findByUserAndGoal(phone, 'daily_fats', today);
      
      if (!existingAchievement) {
        // First time achieving this goal today
        await GoalAchievementRepository.create({
          user: phone,
          goalType: 'daily_fats',
          achievedDate: today,
          value: totals.fats,
          target: user.dailyFats,
          notified: false
        });
        alerts.push(`🧈 Fats goal reached! (${totals.fats}g / ${user.dailyFats}g)`);
      }
    }

    // Send alerts for newly achieved goals
    if (alerts.length > 0) {
      console.log(`[Goals] Sending ${alerts.length} goal alerts to ${phone}`);
      const message = "🎉 *Goal Alert!*\n\n" + alerts.join("\n");
      await sendWhatsAppMessage(phone, message);
      
      // Mark all achievements as notified
      for (const alert of alerts) {
        let goalType = 'daily_proteins';
        if (alert.includes('Protein')) goalType = 'daily_proteins';
        else if (alert.includes('Calories')) goalType = 'daily_calories';
        else if (alert.includes('Carbs')) goalType = 'daily_carbs';
        else if (alert.includes('Fats')) goalType = 'daily_fats';
        
        await GoalAchievementRepository.markAsNotified(phone, goalType, today);
      }
    } else {
      console.log(`[Goals] No new goals reached yet for ${phone}`);
    }
  } catch (error) {
    console.error("[Goals] Error checking goals:", error);
  }
}
