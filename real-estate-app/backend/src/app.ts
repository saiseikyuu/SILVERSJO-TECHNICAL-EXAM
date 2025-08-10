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

// ✅ Parse and trim allowed origins
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()).filter(Boolean)
  : [];

// ✅ Optional: allow all *.vercel.app previews
const vercelPreviewRegex = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // requests without origin (like curl/Postman)
        allowedOrigins.includes(origin) || // exact match
        vercelPreviewRegex.test(origin) // match Vercel preview domains
      ) {
        callback(null, true);
      } else {
        if (process.env.NODE_ENV === "development") {
          console.warn("❌ Blocked CORS origin:", origin);
        }
        callback(new Error("Not allowed by CORS"));
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
