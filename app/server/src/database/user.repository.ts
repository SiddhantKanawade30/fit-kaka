import { User, type UserDocument } from "../schema/user.js";

export class UserRepository {
  static async findByPhone(phone: string): Promise<UserDocument | null> {
    try {
      return await User.findOne({ phone });
    } catch (error) {
      console.error("Error finding user by phone:", error);
      throw error;
    }
  }

  static async create(phone: string): Promise<UserDocument> {
    try {
      const user = new User({ phone });
      return await user.save();
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  static async getOrCreate(phone: string): Promise<UserDocument> {
    try {
      const user = await User.findOneAndUpdate(
        { phone },
        { $setOnInsert: { phone } },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      if (!user) {
        throw new Error(`Failed to get or create user for phone: ${phone}`);
      }

      return user;
    } catch (error) {
      console.error("Error getting or creating user:", error);
      throw error;
    }
  }

  static async updateUser(
    phone: string,
    data: Partial<Pick<UserDocument, "age" | "height" | "weight" | "dailyProteinIntake" | "dailyCalories" | "dailyCarbs" | "dailyFats" | "goalProfileCompleted" | "goalSetupStep">>
  ): Promise<UserDocument | null> {
    try {
      return await User.findOneAndUpdate({ phone }, data, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}
