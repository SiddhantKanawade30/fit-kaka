export const parseAIJson = (text: string) => {
    try {
        // Sometimes AI wraps JSON in ```json ... ```
        const clean = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data = JSON.parse(clean);

        return {
            food: String(data.food || "Unknown food"),
            proteins: isNaN(Number(data.proteins)) ? 0 : Number(data.proteins),
            carbs: isNaN(Number(data.carbs)) ? 0 : Number(data.carbs),
            fats: isNaN(Number(data.fats)) ? 0 : Number(data.fats),
            calories: isNaN(Number(data.calories)) ? 0 : Number(data.calories),
        };
    } catch (error) {
        // Return fallback values when parsing fails
        return {
            food: "Could not analyze food",
            proteins: 0,
            carbs: 0,
            fats: 0,
            calories: 0,
        };
    }
};