export interface NutritionData {
    food: string;
    serving_assumed: string;
    proteins: number;
    carbs: number;
    fats: number;
    calories: number;
}

export interface TwilioWebhookRequest {
    From: string;
    Body: string;
    NumMedia?: string;
    MessageType?: string;
    MediaUrl0?: string;
    MediaContentType0?: string;
}

export interface WhatsAppResponse {
    success: boolean;
    message: string;
    nutrition?: NutritionData;
}