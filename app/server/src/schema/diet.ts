import mongoose from "mongoose";
import type { NextFunction } from "express";

const dietSchema = new mongoose.Schema({
  user: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  goal: { 
    type: String, 
    required: true,
    enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintain_weight']
  },
  isVegetarian: { 
    type: Boolean, 
    required: true 
  },
  preferences: {
    age: Number,
    height: Number, // in cm
    weight: Number, // in kg
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']
    },
    allergies: [String],
    restrictions: [String]
  },
  dietPlan: {
    breakfast: {
      foods: [String],
      calories: Number,
      proteins: Number,
      carbs: Number,
      fats: Number
    },
    lunch: {
      foods: [String],
      calories: Number,
      proteins: Number,
      carbs: Number,
      fats: Number
    },
    evening_snack: {
      foods: [String],
      calories: Number,
      proteins: Number,
      carbs: Number,
      fats: Number
    },
    dinner: {
      foods: [String],
      calories: Number,
      proteins: Number,
      carbs: Number,
      fats: Number
    },
    totalDailyCalories: Number,
    totalDailyProteins: Number,
    totalDailyCarbs: Number,
    totalDailyFats: Number
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export const Diet = mongoose.model('Diet', dietSchema);
