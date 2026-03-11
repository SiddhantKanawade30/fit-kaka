import mongoose from "mongoose";

const goalAchievementSchema = new mongoose.Schema({
  user: { 
    type: String, 
    required: true, 
    index: true 
  },
  goalType: { 
    type: String, 
    required: true,
    enum: ['daily_calories', 'daily_proteins', 'daily_carbs', 'daily_fats']
  },
  achievedDate: { 
    type: Date, 
    required: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  target: { 
    type: Number, 
    required: true 
  },
  notified: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Compound index to ensure unique achievements per user per goal per date
goalAchievementSchema.index({ user: 1, goalType: 1, achievedDate: 1 }, { unique: true });

export const GoalAchievement = mongoose.model('GoalAchievement', goalAchievementSchema);
