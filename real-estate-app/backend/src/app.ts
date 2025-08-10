// app.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import listingsRouter from "./routes/listings";
import uploadsRouter from "./routes/uploads";
import authRouter from "./routes/auth/signup";
import loginRouter from "./routes/auth/login";
import autocompleteRoute from "./routes/autocomplete";
import inquiriesRoute from "./routes/inquiries";

dotenv.config();

const app = express();

// Dynamic CORS origin
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CORS_ORIGIN,
].filter(Boolean); // remove undefined

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
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
