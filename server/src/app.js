import "dotenv/config";
import express from "express";
import cors from "cors";
import chatbotRoutes from "./routes/chatbot.routes.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            if (!origin) {
                return callback(null, true);
            }

            if (
                allowedOrigins.length === 0 ||
                allowedOrigins.includes(origin)
            ) {
                return callback(null, true);
            }

            return callback(new Error("CORS không cho phép origin này."));
        },
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SGU chatbot server is running",
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "SGU chatbot API is healthy",
    });
});

app.use("/api/chat", chatbotRoutes);

export default app;