const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

export async function sendChatMessage(message) {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "Không thể gửi câu hỏi.");
    }

    return result.data;
}