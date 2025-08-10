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

// ✅ Safe CORS setup for multiple origins
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked CORS origin:", origin);
        callback(null, false); // ✅ Gracefully reject without throwing
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/health", (_, res) => res.send({ status: "ok" }));

app.use("/api/listings", listingsRouter);
app.use("/api/uploads", uploadsRouter);
app.use("/api/auth", authRouter);
app.use("/api/auth", loginRouter);
app.use("/api/autocomplete", autocompleteRoute);
app.use("/api/inquiries", inquiriesRoute);

export default app;
