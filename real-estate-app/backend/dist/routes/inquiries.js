"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    const { name, email, message, listing_id } = req.body;
    if (!name || !email || !message || !listing_id) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    const { error } = await supabase_1.supabaseAdmin.from("inquiries").insert([
        {
            name,
            email,
            message,
            listing_id,
        },
    ]);
    if (error) {
        console.error("Insert error:", error.message);
        return res.status(500).json({ error: "Failed to submit inquiry" });
    }
    res.status(201).json({ success: true });
});
exports.default = router;
