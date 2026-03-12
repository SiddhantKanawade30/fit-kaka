import { Router } from 'express';
import { MealRepository } from '../../database/index.js';
import { startOfDay, endOfDay } from 'date-fns';

const dashboardRouter = Router();

dashboardRouter.get('/stats', async (req, res) => {
    try {
        // Get phone number from request (set by middleware)
        const phone = (req as any).phone;
        
        if (!phone) {
            return res.status(401).json({
                success: false,
                message: 'Phone number required'
            });
        }

        // Get today's date range
        const today = new Date();
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);

        // Get today's meals for the user
        const todayMeals = await MealRepository.findByDateRange(
            phone, 
            todayStart, 
            todayEnd
        );

        // Calculate total consumption for today
        const totals = todayMeals.reduce((acc: any, meal: any) => {
            return {
                calories: acc.calories + (meal.calories || 0),
                protein: acc.protein + (meal.proteins || 0),
                fats: acc.fats + (meal.fats || 0),
                carbs: acc.carbs + (meal.carbs || 0)
            };
        }, { calories: 0, protein: 0, fats: 0, carbs: 0 });

        // Set daily targets (you can customize these)
        const dailyTargets = {
            calories: 2200,
            protein: 120,
            fats: 70,
            carbs: 250
        };

        // Calculate progress percentages
        const progress = {
            calories: Math.min((totals.calories / dailyTargets.calories) * 100, 100),
            protein: Math.min((totals.protein / dailyTargets.protein) * 100, 100),
            fats: Math.min((totals.fats / dailyTargets.fats) * 100, 100),
            carbs: Math.min((totals.carbs / dailyTargets.carbs) * 100, 100)
        };

        // Format dashboard stats
        const dashboardStats = [
            {
                title: "Calories Consumed",
                value: totals.calories.toString(),
                target: `${dailyTargets.calories} kcal`,
                unit: "",
                icon: "Flame",
                color: "text-green-600 dark:text-green-400",
                bgClass: "bg-green-100 dark:bg-green-900/30",
                progressClass: "bg-green-500",
                progressValue: Math.round(progress.calories),
            },
            {
                title: "Protein Intake",
                value: `${totals.protein}g`,
                target: `${dailyTargets.protein}g`,
                unit: "",
                icon: "Activity",
                color: "text-foreground",
                bgClass: "bg-neutral-100 dark:bg-neutral-800",
                progressClass: "bg-blue-500",
                progressValue: Math.round(progress.protein),
            },
            {
                title: "Fat Intake",
                value: `${totals.fats}g`,
                target: `${dailyTargets.fats}g`,
                unit: "",
                icon: "Droplets",
                color: "text-blue-500",
                bgClass: "bg-neutral-100 dark:bg-neutral-800",
                progressClass: "bg-cyan-500",
                progressValue: Math.round(progress.fats),
            },
            {
                title: "Nutrition Score",
                value: Math.round((progress.calories + progress.protein + progress.fats) / 3).toString(),
                target: "100",
                unit: "",
                icon: "Activity",
                color: "text-green-600 dark:text-green-400",
                bgClass: "bg-green-100 dark:bg-green-900/30",
                progressClass: "bg-green-500",
                progressValue: Math.round((progress.calories + progress.protein + progress.fats) / 3),
            }
        ];

        res.json({
            success: true,
            data: {
                totals,
                progress,
                dashboardStats,
                mealsCount: todayMeals.length
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard stats'
        });
    }
});

dashboardRouter.get('/meal-history', async (req, res) => {
    try {
        // Get phone number from request (set by middleware)
        const phone = (req as any).phone;
        
        if (!phone) {
            return res.status(401).json({
                success: false,
                message: 'Phone number required'
            });
        }

        // Get all meals for the user
        const userMeals = await MealRepository.findByUser(phone);

        // Format meal history data
        const mealHistory = userMeals.map((meal: any) => ({
            date: meal.createdAt.toISOString().split('T')[0], // Format as YYYY-MM-DD
            mealName: meal.food,
            calories: meal.calories,
            protein: meal.proteins,
            carbs: meal.carbs,
            fats: meal.fats,
            timestamp: meal.createdAt
        }));

        // Sort by date (newest first)
        mealHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        res.json({
            success: true,
            data: {
                mealHistory,
                totalMeals: mealHistory.length,
                lastUpdated: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Meal history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meal history'
        });
    }
});

export default dashboardRouter;