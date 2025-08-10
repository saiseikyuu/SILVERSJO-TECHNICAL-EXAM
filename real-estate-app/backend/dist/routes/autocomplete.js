"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const node_fetch_1 = __importDefault(require("node-fetch"));
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const query = req.query.q;
    if (!query || query.length < 3) {
        return res.status(400).json({ error: "Query too short" });
    }
    const token = process.env.MAPBOX_TOKEN;
    if (!token) {
        return res.status(500).json({ error: "Missing Mapbox token" });
    }
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${token}&autocomplete=true&limit=5&country=PH`;
    try {
        const response = await (0, node_fetch_1.default)(url);
        if (!response.ok) {
            console.error("Mapbox API error:", response.statusText);
            return res.status(502).json({ error: "Mapbox API failed" });
        }
        const raw = await response.json();
        // Runtime validation
        if (!raw ||
            typeof raw !== "object" ||
            !Array.isArray(raw.features)) {
            return res.status(502).json({ error: "Invalid Mapbox response" });
        }
        const data = {
            features: raw.features.map((f) => ({
                place_name: f.place_name,
                center: f.center,
            })),
        };
        const suggestions = data.features.map((f) => ({
            place_name: f.place_name,
            coordinates: f.center,
        }));
        res.json(suggestions);
    }
    catch (err) {
        console.error("Autocomplete error:", err);
        res.status(500).json({ error: "Failed to fetch suggestions" });
    }
});
exports.default = router;
