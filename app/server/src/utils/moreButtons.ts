import axios from "axios";


export async function sendMoreButton(to: string, text: string) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.PHONE_NUMBER_ID;

    await axios.post(
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
}