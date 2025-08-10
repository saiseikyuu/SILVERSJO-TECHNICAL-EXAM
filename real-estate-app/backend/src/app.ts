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
  console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
}

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
  : [];

const vercelPreviewRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // allow non-browser requests
        allowedOrigins.includes(origin) ||
        vercelPreviewRegex.test(origin)
      ) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked CORS origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
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
