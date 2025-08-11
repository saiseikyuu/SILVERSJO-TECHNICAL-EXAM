import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listingsRouter from "./routes/listings.js";
import uploadsRouter from "./routes/uploads.js";
import authRouter from "./routes/auth/signup.js";
import loginRouter from "./routes/auth/login.js";
import autocompleteRoute from "./routes/autocomplete.js";
import inquiriesRoute from "./routes/inquiries.js";
dotenv.config();
const app = express();
// ✅ Log CORS_ORIGIN for debugging (always)
console.log("✅ Loaded CORS_ORIGIN:", process.env.CORS_ORIGIN);
// ✅ Parse allowed origins from .env
const envAllowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
    : [];
// ✅ Regex to match Vercel preview and production deployments
const vercelDomainRegex = /^https:\/\/[a-z0-9.-]+\.vercel\.app$/i;
// ✅ Default allowed origins
const defaultAllowedOrigins = [
    "http://localhost:3000", // local dev
    ...envAllowedOrigins, // from Railway env vars
];
// ✅ CORS middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) {
            // Allow server-to-server or Postman requests
            return callback(null, true);
        }
        if (defaultAllowedOrigins.includes(origin) ||
            vercelDomainRegex.test(origin)) {
            return callback(null, true);
        }
        console.warn("❌ Blocked CORS origin:", origin);
        return callback(null, false); // ✅ Graceful rejection
    },
    credentials: true,
}));
app.use(express.json());
// ✅ Health check
app.get("/health", (_, res) => res.send({ status: "ok" }));
// ✅ Routes
app.use("/api/listings", listingsRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", loginRouter);
app.use("/api/autocomplete", autocompleteRoute);
app.use("/api/inquiries", inquiriesRoute);
// ✅ Global error handler
app.use((err, req, res, next) => {
    console.error("🔥 Server error:", err.stack || err);
    res.status(500).json({ error: err.message || "Internal server error" });
});
export default app;
