import "dotenv/config";
import express from "express";
import cors from "cors";
import chatbotRoutes from "./routes/chatbot.routes.js";

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://sgu-tvts-chatbot.vercel.app",
    "https://sguhoangphong.vercel.app",
];

const corsOptions = {
    origin(origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("CORS không cho phép origin này."));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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