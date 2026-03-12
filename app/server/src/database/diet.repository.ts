import mongoose from "mongoose";
import { Diet } from "../schema/diet.js";

export class DietRepository {
  static async create(dietData: any) {
    try {
      const diet = new Diet(dietData);
      return await diet.save();
    } catch (error) {
      const mongoError = error as { code?: number };
      if (mongoError?.code === 11000 && dietData?.user) {
        return await Diet.findOneAndUpdate(
          { user: dietData.user },
          { ...dietData, updatedAt: new Date() },
          { new: true }
        );
      }
      console.error("Error creating diet:", error);
      throw error;
    }
  }

  static async findByUser(user: string) {
    try {
      return await Diet.findOne({ user });
    } catch (error) {
      console.error("Error finding diet by user:", error);
      throw error;
    }
  }

  static async updateByUser(user: string, updateData: any) {
    try {
      return await Diet.findOneAndUpdate(
        { user },
        { ...updateData, updatedAt: new Date() },
        { new: true, upsert: true }
      );
    } catch (error) {
      console.error("Error updating diet by user:", error);
      throw error;
    }
  }

  static async deleteByUser(user: string) {
    try {
      return await Diet.deleteOne({ user });
    } catch (error) {
      console.error("Error deleting diet by user:", error);
      throw error;
    }
  }

  static async getAllDiets() {
    try {
      return await Diet.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error("Error getting all diets:", error);
      throw error;
    }
  }
}
