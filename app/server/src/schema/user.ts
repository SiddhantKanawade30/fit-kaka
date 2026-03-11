import mongoose from "mongoose";

export type ActivityLevel = "low" | "moderate" | "high";
export type GoalType = "weight_loss" | "muscle_gain" | "maintain";
export type GoalSetupStep = "age" | "height" | "weight" | "activity" | "goal";

export interface UserDocument extends mongoose.Document {
	phone: string;
	age?: number;
	height?: number;
	weight?: number;
	activityLevel?: ActivityLevel;
	goal?: GoalType;
	goalProfileCompleted: boolean;
	goalSetupStep: GoalSetupStep | null;
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		phone: { type: String, required: true, unique: true, index: true },
		age: { type: Number },
		height: { type: Number },
		weight: { type: Number },
		activityLevel: {
			type: String,
			enum: ["low", "moderate", "high"],
		},
		goal: {
			type: String,
			enum: ["weight_loss", "muscle_gain", "maintain"],
		},
		goalProfileCompleted: { type: Boolean, default: false },
		goalSetupStep: {
			type: String,
			enum: ["age", "height", "weight", "activity", "goal", null],
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model<UserDocument>("User", userSchema);
