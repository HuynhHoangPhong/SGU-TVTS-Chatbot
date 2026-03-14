import { getChatbotResponse } from "../services/chatbot.service.js";

export function handleChatRequest(req, res) {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({
            success: false,
            message: "Câu hỏi không hợp lệ."
        });
    }

    const result = getChatbotResponse(message);

    return res.json({
        success: true,
        data: {
            reply: result.answer,
            source: result.source,
            title: result.title || null,
            document: result.document || null
        }
    });
}