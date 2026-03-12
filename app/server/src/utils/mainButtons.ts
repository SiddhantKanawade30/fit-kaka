import axios from "axios";

export async function sendMainOptions(to: string) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                to,
                type: "interactive",
                interactive: {
                    type: "list",
                    header: {
                        type: "text",
                        text: " Fit-Kaka Options"
                    },
                    body: {
                        text: "Choose what you'd like to do:"
                    },
                    footer: {
                        text: "Powered by Fit-Kaka"
                    },
                    action: {
                        button: "View Options",
                        sections: [
                            {
                                title: "Health & Tracking",
                                rows: [
                                    {
                                        id: "health_score",
                                        title: "📊 Health Score",
                                        description: "Get health rating for today's meals"
                                    },
                                    {
                                        id: "custom_diet",
                                        title: "🎯 Customize Diet",
                                        description: "Get personalized diet recommendations"
                                    },
                                    {
                                        id: "set_goal",
                                        title: "🏆 Set Goals",
                                        description: "Set your fitness and nutrition goals"
                                    }
                                ]
                            }
                        ]
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        console.log("Main options sent successfully:", response.data);
    } catch (error) {
        console.error("Error sending main options:", error instanceof Error ? (error as any).response?.data || error.message : error);
        throw error;
    }
}