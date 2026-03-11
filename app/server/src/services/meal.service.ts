import { Meal } from "../schema/meal.js";

export const saveMeal = async(user: string, data: any) => {
    return Meal.create({
        user,
        ...data
    });
};