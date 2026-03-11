import mongoose from "mongoose";

export type GoalSetupStep = "age" | "height" | "weight" | "macros";

export interface UserDocument extends mongoose.Document {
	phone: string;
	age?: number;
	height?: number;
	weight?: number;
	dailyProteinIntake?: number;
	dailyCalories?: number;
	dailyCarbs?: number;
	dailyFats?: number;
	goalProfileCompleted: boolean;
	goalSetupStep: GoalSetupStep | null;
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		phone: { type: String, required: true, unique: true, index: true },
		age: { type: Number },
		height: { type: Number },
		weight: { type: Number },
		dailyProteinIntake: { type: Number },
		dailyCalories: { type: Number },
		dailyCarbs: { type: Number },
		dailyFats: { type: Number },
		goalProfileCompleted: { type: Boolean, default: false },
		goalSetupStep: {
			type: String,
			enum: ["age", "height", "weight", "macros", null],
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

export const User = mongoose.model<UserDocument>("User", userSchema);
