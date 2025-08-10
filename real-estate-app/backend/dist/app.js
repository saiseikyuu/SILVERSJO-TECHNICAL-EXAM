"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const listings_1 = __importDefault(require("./routes/listings"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const signup_1 = __importDefault(require("./routes/auth/signup"));
const login_1 = __importDefault(require("./routes/auth/login"));
const autocomplete_1 = __importDefault(require("./routes/autocomplete"));
const inquiries_1 = __importDefault(require("./routes/inquiries"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Dynamic CORS origin
const allowedOrigins = [
    "http://localhost:3000",
    process.env.CORS_ORIGIN,
].filter(Boolean); // remove undefined
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.get("/health", (_, res) => res.send({ status: "ok" }));
app.use("/api/listings", listings_1.default);
app.use("/api/uploads", uploads_1.default);
app.use("/api/auth", signup_1.default);
app.use("/api/auth", login_1.default);
app.use("/api/autocomplete", autocomplete_1.default);
app.use("/api/inquiries", inquiries_1.default);
exports.default = app;
