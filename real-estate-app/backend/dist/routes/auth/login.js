"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const router = (0, express_1.Router)();
// Use public Supabase client for login
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY // ✅ Use anon key for auth
);
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
        return res.status(401).json({ error: error?.message || 'Invalid credentials.' });
    }
    // Optionally fetch profile
    const { user } = data;
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profileError) {
        return res.status(500).json({ error: profileError.message });
    }
    return res.status(200).json({
        access_token: data.session.access_token,
        user: {
            id: user.id,
            email: user.email,
            role: profile.role
        }
    });
});
exports.default = router;
