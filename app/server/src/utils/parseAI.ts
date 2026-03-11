

export const parseAIJson = (text: string) => {
    try {
        if (!text) throw new Error("No text provided to parser");

        // Clean up markdown code blocks if the AI includes them
        const clean = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const data = JSON.parse(clean);

        return {
            food: String(data.food || "Unknown food"),
            proteins: Number(data.proteins) || 0,
            carbs: Number(data.carbs) || 0,
            fats: Number(data.fats) || 0,
            calories: Number(data.calories) || 0,
        };
    } catch (error) {
        console.error("Parse Error. Raw text was:", text);
        return {
            food: "Could not analyze food",
            proteins: 0,
            carbs: 0,
            fats: 0,
            calories: 0,
        };
    }
};