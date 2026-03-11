import mongoose from "mongoose";
import { Meal } from "../schema/meal.js";

export class MealRepository {
  static async create(user: string, nutritionData: any) {
    try {
      const meal = new Meal({
        user,
        ...nutritionData
      });
      return await meal.save();
    } catch (error) {
      console.error("Error creating meal:", error);
      throw error;
    }
  }

  static async findByUser(user: string, limit: number = 10) {
    try {
      return await Meal.find({ user })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error("Error finding meals by user:", error);
      throw error;
    }
  }

  static async findByDateRange(user: string, startDate: Date, endDate: Date) {
    try {
      return await Meal.find({
        user,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error finding meals by date range:", error);
      throw error;
    }
  }

  static async getTodayMeals(user: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return await Meal.find({
        user,
        createdAt: {
          $gte: today,
          $lt: tomorrow
        }
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error getting today's meals:", error);
      throw error;
    }
  }

  static async getWeeklyMeals(user: string) {
    try {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      return await Meal.find({
        user,
        createdAt: {
          $gte: weekAgo
        }
      }).sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error getting weekly meals:", error);
      throw error;
    }
  }

  static async getLastMeal(user: string) {
    try {
      return await Meal.findOne({ user })
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error getting last meal:", error);
      throw error;
    }
  }
}