import express from "express";
import dotenv from "dotenv";
import whatsappRouter from "./routes/whatsapp.js";
import { connectDB } from "./config/db.js";
import { userMiddleware } from "./api/auth/middleware.js";
import loginRouter from "./api/auth/login.js";
import dashboardRouter from "./api/dashboard/index.js";
import mealsRouter from "./routes/meals.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

connectDB();

// WhatsApp webhook routes
app.use("/", whatsappRouter);

// Meals and user profile routes
app.use("/", mealsRouter);

// Auth routes
app.use("/auth", loginRouter);

app.use("/dashboard", userMiddleware, dashboardRouter);

// Health check
app.get("/", (req, res) => {
    res.send("Fit-Kaka Engine Online");
});

// Debug: Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});