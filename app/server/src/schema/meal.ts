import mongoose from "mongoose";
const Schema = mongoose.Schema;


const mealSchema = new Schema({
  user: { type: String, required: true },
  food: { type: String, required: true },
  proteins: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  calories: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Meal = mongoose.model('Meal', mealSchema);