export type MealHistoryItem = {
	date: string;
	mealName: string;
	calories: number;
	protein: number;
};

export type BasicProfile = {
	age: number | null;
	height: number | null;
	weight: number | null;
};

type MealsApiResponse = {
	success: boolean;
	count: number;
	data: MealHistoryItem[];
	message?: string;
};

type ProfileApiResponse = {
	success: boolean;
	data?: BasicProfile;
	message?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

function buildPhoneCandidates(phone: string) {
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

	return [...candidates].filter(Boolean);
}

export function getStoredPhone() {
	if (typeof window === "undefined") {
		return null;
	}

	return localStorage.getItem("fitkaka_phone");
}

export async function fetchMealHistory(phone: string) {
	let lastError = "No meals found";

	for (const candidate of buildPhoneCandidates(phone)) {
		const response = await fetch(`${API_BASE_URL}/api/meals/${candidate}`, {
			cache: "no-store",
		});
		const payload = (await response.json()) as MealsApiResponse;

		if (response.ok && payload.success) {
			if (payload.count > 0 || candidate === buildPhoneCandidates(phone).at(-1)) {
				return payload.data;
			}
		}

		lastError = payload.message ?? lastError;
	}

	throw new Error(lastError);
}

export async function fetchBasicProfile(phone: string) {
	let lastError = "User not found";

	for (const candidate of buildPhoneCandidates(phone)) {
		const response = await fetch(`${API_BASE_URL}/api/users/${candidate}/basic`, {
			cache: "no-store",
		});
		const payload = (await response.json()) as ProfileApiResponse;

		if (response.ok && payload.success && payload.data) {
			return payload.data;
		}

		lastError = payload.message ?? lastError;
	}

	throw new Error(lastError);
}