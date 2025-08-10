"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const supabase_1 = require("../lib/supabase");
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    const { data, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    req.user = data.user;
    next();
}
