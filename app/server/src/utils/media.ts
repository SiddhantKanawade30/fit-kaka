import axios from "axios";

export async function downloadWhatsAppImage(imageId: string) {
    const token = process.env.WHATSAPP_TOKEN;

    if (!token) {
        throw new Error("WhatsApp token not configured");
    }

    try {
        const metaRes = await axios.get(
            `https://graph.facebook.com/v19.0/${imageId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const imageUrl = metaRes.data.url;

        const imageRes = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return Buffer.from(imageRes.data);
    } catch (error) {
        console.error("Error downloading WhatsApp image:", error);
        throw error;
    }
}