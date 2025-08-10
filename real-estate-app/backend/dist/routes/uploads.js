"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//routes/uploads.ts
const express_1 = require("express");
const requireAuth_1 = require("../middleware/requireAuth");
const requireAdmin_1 = require("../middleware/requireAdmin");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const uploadSchema = zod_1.z.object({
    filename: zod_1.z.string()
});
router.post('/url', requireAuth_1.requireAuth, requireAdmin_1.requireAdmin, async (req, res) => {
    const parse = uploadSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.issues });
    const { filename } = parse.data;
    const bucket = 'listing-images';
    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`;
    res.json({ publicUrl });
});
exports.default = router;
