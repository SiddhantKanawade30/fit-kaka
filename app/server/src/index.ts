import express from "express";
import dotenv from "dotenv";
import whatsappRouter from "./routes/whatsapp.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

// Required for Twilio webhooks
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

connectDB();

// WhatsApp webhook routes
app.use("/", whatsappRouter);

// Health check
app.get("/", (req, res) => {
    res.send("Fit-Kaka Engine Online");
});

// Debug: Log all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});