import { UserRepository } from "../database/index.js";
import type { ActivityLevel, GoalSetupStep, GoalType, UserDocument } from "../schema/user.js";

export type UserUpdatableFields = Partial<{
  age: number;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  goalProfileCompleted: boolean;
  goalSetupStep: GoalSetupStep | null;
}>;

export async function getOrCreateUser(phone: string): Promise<UserDocument> {
  const existing = await UserRepository.findByPhone(phone);
  if (existing) {
    return existing;
  }

  return UserRepository.create(phone);
}

export async function updateUser(phone: string, data: UserUpdatableFields): Promise<UserDocument | null> {
  return UserRepository.updateUser(phone, data);
}
