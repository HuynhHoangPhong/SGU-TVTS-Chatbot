import { useEffect, useRef, useState } from "react";
import { quickQuestions } from "../../data/chatbotData";
import { sendChatMessage } from "../../services/chatbotApi";

export default function ChatbotBox() {
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Xin chào, mình là chatbot tư vấn tuyển sinh. Bạn có thể hỏi về ngành học, học phí, phương thức xét tuyển, V-SAT hoặc kỳ thi năng khiếu.",
            document: null,
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [openedPreviewIndex, setOpenedPreviewIndex] = useState(null);
    const [fullscreenDocument, setFullscreenDocument] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isBotTyping, openedPreviewIndex]);

    useEffect(() => {
        if (fullscreenDocument) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [fullscreenDocument]);

    const handleSendMessage = async () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isBotTyping) return;

        const userMessage = {
            role: "user",
            text: trimmedValue,
            document: null,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsBotTyping(true);

        try {
            const data = await sendChatMessage(trimmedValue);

            const botMessage = {
                role: "bot",
                text: data.reply,
                document: data.document || null,
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = {
                role: "bot",
                text: "Hiện tại chatbot chưa kết nối được máy chủ. Bạn vui lòng kiểm tra backend hoặc thử lại sau.",
                document: null,
            };

            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsBotTyping(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickQuestion = (question) => {
        setInputValue(question);
    };

    const togglePreview = (index) => {
        setOpenedPreviewIndex((prev) => (prev === index ? null : index));
    };

    const openFullscreenDocument = (documentItem) => {
        setFullscreenDocument(documentItem);
    };

    const closeFullscreenDocument = () => {
        setFullscreenDocument(null);
    };

    return (
        <>
            <div className="chatbot-card h-100 fade-in-up delay-1">
                <div className="chatbot-header">
                    <div>
                        <h4>Chatbot</h4>
                        <p>Tư vấn tuyển sinh Trường Đại học Sài Gòn</p>
                    </div>
                    <span className="chat-status-badge">Đang hoạt động</span>
                </div>

                <div className="quick-question-wrapper">
                    {quickQuestions.map((question) => (
                        <button
                            key={question}
                            type="button"
                            className="quick-question-btn"
                            onClick={() => handleQuickQuestion(question)}
                        >
                            {question}
                        </button>
                    ))}
                </div>

                <div className="chat-messages-area">
                    {messages.map((message, index) => (
                        <div
                            key={`${message.role}-${index}`}
                            className={`message-row ${
                                message.role === "user" ? "user-row" : "bot-row"
                            }`}
                        >
                            <div
                                className={`chat-bubble ${
                                    message.role === "user"
                                        ? "user-bubble"
                                        : "bot-bubble"
                                }`}
                            >
                                <div>{message.text}</div>

                                {message.role === "bot" && message.document && (
                                    <div className="chat-document-card">
                                        <div className="chat-document-title">
                                            File liên quan: {message.document.title}
                                        </div>

                                        <div className="chat-actions d-flex flex-wrap gap-2 mt-3">
                                            <button
                                                type="button"
                                                className="btn send-btn"
                                                onClick={() => togglePreview(index)}
                                            >
                                                {openedPreviewIndex === index
                                                    ? "Ẩn PDF"
                                                    : "Xem PDF"}
                                            </button>

                                            <button
                                                type="button"
                                                className="btn send-btn"
                                                onClick={() =>
                                                    openFullscreenDocument(
                                                        message.document
                                                    )
                                                }
                                            >
                                                Xem toàn màn hình
                                            </button>
                                        </div>

                                        {openedPreviewIndex === index && (
                                            <div className="chat-pdf-preview mt-3">
                                                <iframe
                                                    src={message.document.url}
                                                    title={message.document.title}
                                                    className="chat-pdf-frame"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isBotTyping && (
                        <div className="message-row bot-row">
                            <div className="chat-bubble bot-bubble typing-bubble">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef}></div>
                </div>

                <div className="chat-input-area">
                    <textarea
                        className="form-control chat-input"
                        rows="3"
                        placeholder="Nhập câu hỏi của bạn..."
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        onKeyDown={handleKeyDown}
                    ></textarea>

                    <div className="chat-actions d-flex justify-content-end mt-3">
                        <button
                            type="button"
                            className="btn send-btn"
                            onClick={handleSendMessage}
                        >
                            Gửi câu hỏi
                        </button>
                    </div>
                </div>
            </div>

            {fullscreenDocument && (
                <div
                    className="pdf-fullscreen-modal"
                    onClick={closeFullscreenDocument}
                >
                    <div
                        className="pdf-fullscreen-dialog"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="pdf-fullscreen-header">
                            <h5 className="pdf-fullscreen-title">
                                {fullscreenDocument.title}
                            </h5>

                            <div className="pdf-fullscreen-actions">
                                <button
                                    type="button"
                                    className="btn send-btn"
                                    onClick={closeFullscreenDocument}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>

                        <div className="pdf-fullscreen-body">
                            <iframe
                                src={fullscreenDocument.url}
                                title={fullscreenDocument.title}
                                className="pdf-fullscreen-frame"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}