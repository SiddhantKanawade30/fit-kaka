import { Router } from "express";
import type { Request, Response } from "express";
import { MealRepository, UserRepository } from "../database/index.js";

const router = Router();

function getPhoneCandidates(phone: string) {
	const normalized = phone.replace(/\D/g, "");
	const candidates = new Set<string>();

	candidates.add(phone);
	candidates.add(normalized);

	if (normalized.length === 10) {
		candidates.add(`91${normalized}`);
		candidates.add(`+91${normalized}`);
	}

	if (normalized.length === 12 && normalized.startsWith("91")) {
		candidates.add(normalized.slice(2));
		candidates.add(`+${normalized}`);
	}

	if (phone.startsWith("+") && normalized.length > 0) {
		candidates.add(normalized);
	}

	return [...candidates].filter(Boolean);
}

router.get("/api/meals/:phone", async (req: Request, res: Response) => {
	try {
		const phone = req.params.phone;

		if (!phone || typeof phone !== "string") {
			return res.status(400).json({
				success: false,
				message: "Phone parameter is required",
			});
		}

		const candidates = getPhoneCandidates(phone);
		let meals: any[] = [];

		for (const candidate of candidates) {
			const result = await MealRepository.findByUser(candidate, 100);
			if (result.length > 0) {
				meals = result;
				break;
			}
		}

		const data = meals.map((meal: any) => ({
			date: meal.createdAt,
			mealName: meal.food,
			calories: meal.calories,
			protein: meal.proteins,
			carbs: meal.carbs,
			fats: meal.fats,
		}));

		return res.status(200).json({
			success: true,
			count: data.length,
			data,
		});
	} catch (error) {
		console.error("Error fetching meals:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch meals",
		});
	}
});

router.get("/api/users/:phone/basic", async (req: Request, res: Response) => {
	try {
		const phone = req.params.phone;

		if (!phone || typeof phone !== "string") {
			return res.status(400).json({
				success: false,
				message: "Phone parameter is required",
			});
		}

		const candidates = getPhoneCandidates(phone);
		let user = null;

		for (const candidate of candidates) {
			user = await UserRepository.findByPhone(candidate);
			if (user) {
				break;
			}
		}

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: {
				age: user.age ?? null,
				height: user.height ?? null,
				weight: user.weight ?? null,
			},
		});
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to fetch user profile",
		});
	}
});

router.put("/api/users/:phone/basic", async (req: Request, res: Response) => {
	try {
		const phone = req.params.phone;

		if (!phone || typeof phone !== "string") {
			return res.status(400).json({
				success: false,
				message: "Phone parameter is required",
			});
		}

		const { age, height, weight } = req.body ?? {};

		if (age == null || height == null || weight == null) {
			return res.status(400).json({
				success: false,
				message: "age, height, and weight are required",
			});
		}

		const parsedAge = Number(age);
		const parsedHeight = Number(height);
		const parsedWeight = Number(weight);

		if (!Number.isFinite(parsedAge) || parsedAge < 10 || parsedAge > 120) {
			return res.status(400).json({ success: false, message: "Age must be between 10 and 120" });
		}

		if (!Number.isFinite(parsedHeight) || parsedHeight < 90 || parsedHeight > 250) {
			return res.status(400).json({ success: false, message: "Height must be between 90 and 250 cm" });
		}

		if (!Number.isFinite(parsedWeight) || parsedWeight < 20 || parsedWeight > 400) {
			return res.status(400).json({ success: false, message: "Weight must be between 20 and 400 kg" });
		}

		const candidates = getPhoneCandidates(phone);
		let targetPhone: string | null = null;

		for (const candidate of candidates) {
			const existing = await UserRepository.findByPhone(candidate);
			if (existing) {
				targetPhone = existing.phone;
				break;
			}
		}

		if (!targetPhone) {
			targetPhone = candidates[0] ?? phone;
		}

		const now = new Date();
		const updated = await UserRepository.updateUser(targetPhone, {
			age: parsedAge,
			height: parsedHeight,
			weight: parsedWeight,
			ageUpdatedAt: now,
			heightUpdatedAt: now,
			weightUpdatedAt: now,
			goalProfileCompleted: true,
		});

		if (!updated) {
			return res.status(500).json({
				success: false,
				message: "Failed to update user profile",
			});
		}

		return res.status(200).json({
			success: true,
			data: {
				age: updated.age ?? null,
				height: updated.height ?? null,
				weight: updated.weight ?? null,
			},
		});
	} catch (error) {
		console.error("Error updating user profile:", error);
		return res.status(500).json({
			success: false,
			message: "Failed to update user profile",
		});
	}
});

export default router;
