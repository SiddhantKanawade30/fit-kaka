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

  static async updateUser(
    phone: string,
    data: Partial<Pick<UserDocument, "age" | "height" | "weight" | "activityLevel" | "goal" | "goalProfileCompleted" | "goalSetupStep">>
  ): Promise<UserDocument | null> {
    try {
      return await User.findOneAndUpdate({ phone }, data, {
        new: true,
        upsert: false,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}
