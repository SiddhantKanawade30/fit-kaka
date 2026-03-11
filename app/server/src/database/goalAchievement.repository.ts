import mongoose from "mongoose";
import { GoalAchievement } from "../schema/goalAchievement.js";

export class GoalAchievementRepository {
  static async create(achievementData: any) {
    try {
      const achievement = new GoalAchievement(achievementData);
      return await achievement.save();
    } catch (error) {
      console.error("Error creating goal achievement:", error);
      throw error;
    }
  }

  static async findByUserAndGoal(user: string, goalType: string, date: Date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await GoalAchievement.findOne({
        user,
        goalType,
        achievedDate: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      });
    } catch (error) {
      console.error("Error finding goal achievement:", error);
      throw error;
    }
  }

  static async findByUser(user: string, limit: number = 10) {
    try {
      return await GoalAchievement.find({ user })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      console.error("Error finding achievements by user:", error);
      throw error;
    }
  }

  static async markAsNotified(user: string, goalType: string, date: Date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      return await GoalAchievement.findOneAndUpdate(
        {
          user,
          goalType,
          achievedDate: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        },
        { notified: true },
        { new: true }
      );
    } catch (error) {
      console.error("Error marking achievement as notified:", error);
      throw error;
    }
  }

  static async getUnnotifiedAchievements(user: string) {
    try {
      return await GoalAchievement.find({
        user,
        notified: false
      }).sort({ createdAt: 1 });
    } catch (error) {
      console.error("Error getting unnotified achievements:", error);
      throw error;
    }
  }

  static async deleteByUser(user: string) {
    try {
      return await GoalAchievement.deleteMany({ user });
    } catch (error) {
      console.error("Error deleting achievements by user:", error);
      throw error;
    }
  }
}
