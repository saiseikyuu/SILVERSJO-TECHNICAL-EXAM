"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../../lib/supabase");
const router = (0, express_1.Router)();
router.post('/signup', async (req, res) => {
    const { email, password, role = 'user' } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    // Create user in Supabase Auth
    const { data: userData, error: userError } = await supabase_1.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role }
    });
    if (userError || !userData?.user?.id) {
        return res.status(500).json({ error: userError?.message || 'Failed to create user.' });
    }
    const { id } = userData.user;
    // Insert into profiles table
    const { error: profileError } = await supabase_1.supabaseAdmin
        .from('profiles')
        .insert([{ id, email, role }]);
    if (profileError) {
        return res.status(500).json({ error: profileError.message });
    }
    return res.status(201).json({ message: `User ${email} created with role ${role}` });
});
exports.default = router;
