import axios from "axios";

export async function sendWhatsAppMessage(to: string, text: string) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
        console.error("Missing WhatsApp credentials:", {
            token: token ? "present" : "missing",
            phoneNumberId: phoneNumberId ? "present" : "missing"
        });
        throw new Error("WhatsApp credentials not configured");
    }

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: {
                    preview_url: true,
                    body: text,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        
        console.log("WhatsApp message sent successfully:", {
            to,
            messageId: response.data?.messages?.[0]?.id
        });
        return response.data;
    } catch (error) {
        console.error("Error sending WhatsApp message:", {
            error: (error as any).response?.data || (error as Error).message,
            status: (error as any).response?.status,
            to,
            textLength: text.length
        });
        throw error;
    }
}

export async function sendWhatsAppTypingIndicator(messageId: string) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
        console.error("Missing WhatsApp credentials:", {
            token: token ? "present" : "missing",
            phoneNumberId: phoneNumberId ? "present" : "missing"
        });
        throw new Error("WhatsApp credentials not configured");
    }

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                status: "read",
                message_id: messageId,
                typing_indicator: {
                    type: "text",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("WhatsApp typing indicator sent successfully:", { messageId });
        return response.data;
    } catch (error) {
        console.error("Error sending WhatsApp typing indicator:", {
            error: (error as any).response?.data || (error as Error).message,
            status: (error as any).response?.status,
            messageId,
        });
        throw error;
    }
}

export async function sendDietOptionsList(to: string, headerText: string = "🎯 Diet Options") {
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
                        text: headerText
                    },
                    body: {
                        text: "Choose your fitness goal:"
                    },
                    footer: {
                        text: "Powered by Fit-Kaka"
                    },
                    action: {
                        button: "Select Goal",
                        sections: [
                            {
                                title: "🏃‍♂️ Weight Management",
                                rows: [
                                    {
                                        id: "weight_loss",
                                        title: "📉 Weight Loss",
                                        description: "Lose weight with personalized diet"
                                    },
                                    {
                                        id: "weight_gain", 
                                        title: "📈 Weight Gain",
                                        description: "Gain weight healthily"
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
        
        console.log("Diet options list sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending diet options list:", (error as any).response?.data || (error as Error).message);
        throw error;
    }
}

export async function sendExistingDietList(to: string) {
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
                        text: "🍽️ Diet Plan Options"
                    },
                    body: {
                        text: "You already have a diet plan! What would you like to do?"
                    },
                    footer: {
                        text: "Powered by Fit-Kaka"
                    },
                    action: {
                        button: "Choose Action",
                        sections: [
                            {
                                title: "📋 Plan Management",
                                rows: [
                                    {
                                        id: "view_diet",
                                        title: "👁️ View Current Plan",
                                        description: "See your existing diet plan"
                                    },
                                    {
                                        id: "update_diet",
                                        title: "✏️ Update Diet Plan", 
                                        description: "Modify your current diet plan"
                                    },
                                    {
                                        id: "main_menu",
                                        title: "🏠 Main Menu",
                                        description: "Go back to main options"
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
        
        console.log("Existing diet list sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending existing diet list:", (error as any).response?.data || (error as Error).message);
        throw error;
    }
}

export async function sendVegetarianOptions(to: string, message: string = "Are you vegetarian?") {
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
                    type: "button",
                    body: {
                        text: message + "\n\nChoose below 👇"
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "vegetarian_yes",
                                    title: "🥗 Yes"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "vegetarian_no",
                                    title: "🍗 No"
                                }
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
        
        console.log("Vegetarian options sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending vegetarian options:", (error as any).response?.data || (error as Error).message);
        throw error;
    }
}

export async function sendMoreButton(to: string, text: string) {
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
                    type: "button",
                    body: {
                        text: text + "\n\nTap below for more options 👇"
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "more_options",
                                    title: "More"
                                }
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
        
        console.log("More button sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending more button:", (error as any).response?.data || (error as Error).message);
        throw error;
    }
}

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
                        text: "📊 Fit-Kaka Options"
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
                                        description: "Get health rating for your last meal"
                                    },
                                    {
                                        id: "daily_summary",
                                        title: "📈 Daily Summary",
                                        description: "View today's nutrition totals"
                                    }
                                ]
                            },
                            {
                                title: "Goals & Planning",
                                rows: [
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
        return response.data;
    } catch (error) {
        console.error("Error sending main options:", (error as any).response?.data || (error as Error).message);
        throw error;
    }
}

export async function sendGoalOptions(to: string, message = "Choose your fitness goal:") {
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
                    type: "button",
                    body: {
                        text: message
                    },
                    action: {
                        buttons: [
                            {
                                type: "reply",
                                reply: {
                                    id: "goal_weight_loss",
                                    title: "Weight Loss"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "goal_muscle_gain",
                                    title: "Muscle Gain"
                                }
                            },
                            {
                                type: "reply",
                                reply: {
                                    id: "goal_maintain",
                                    title: "Maintain"
                                }
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

        console.log("Goal options sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending goal options:", (error as any).response?.data || (error as Error).message);
        throw error;
    }
}