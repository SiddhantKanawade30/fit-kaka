import { Router } from "express";
import type { Request, Response } from "express";
import { MealRepository, UserRepository } from "../database/index.js";

const router = Router();

router.get("/api/meals/:phone", async (req: Request, res: Response) => {
	try {
		const phone = req.params.phone;

		if (!phone || typeof phone !== "string") {
			return res.status(400).json({
				success: false,
				message: "Phone parameter is required",
			});
		}

		const meals = await MealRepository.findByUser(phone, 100);

		const data = meals.map((meal: any) => ({
			date: meal.createdAt,
			mealName: meal.food,
			calories: meal.calories,
			protein: meal.proteins,
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

		const user = await UserRepository.findByPhone(phone);

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

export default router;
