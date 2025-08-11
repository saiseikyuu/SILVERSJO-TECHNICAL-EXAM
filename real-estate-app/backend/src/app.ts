import express, { Request, Response, NextFunction } from "express";
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

// Log env for debugging in development
if (process.env.NODE_ENV !== "production") {
  console.log("CORS_ORIGIN from .env:", process.env.CORS_ORIGIN);
}

// Prepare custom CORS list from .env (optional)
const envAllowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
  : [];

// Regex to match Vercel preview and production deployments
const vercelDomainRegex = /^https:\/\/[a-z0-9.-]+\.vercel\.app$/i;

// Default allowed origins
const defaultAllowedOrigins = [
  "http://localhost:3000", // local dev
  ...envAllowedOrigins,    // any from .env
];

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        // Allow server-to-server or Postman requests
        return callback(null, true);
      }

      if (
        defaultAllowedOrigins.includes(origin) ||
        vercelDomainRegex.test(origin)
      ) {
        return callback(null, true);
      }

      console.warn("❌ Blocked CORS origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/health", (_, res) => res.send({ status: "ok" }));

// Routes
app.use("/api/listings", listingsRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", loginRouter);
app.use("/api/autocomplete", autocompleteRoute);
app.use("/api/inquiries", inquiriesRoute);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("🔥 Server error:", err.stack || err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
