"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const requireAuth_1 = require("../middleware/requireAuth");
const requireAdmin_1 = require("../middleware/requireAdmin");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// ✅ Updated Zod schema with coordinates
const listingSchema = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    location: zod_1.z.string(),
    price: zod_1.z.number(),
    property_type: zod_1.z.enum(['Apartment', 'House', 'Commercial']),
    status: zod_1.z.enum(['For Sale', 'For Rent']),
    images: zod_1.z.array(zod_1.z.string()).optional(),
    coordinates: zod_1.z.object({
        lat: zod_1.z.number(),
        lng: zod_1.z.number(),
    }),
});
// GET /api/listings — search, filter, paginate
router.get('/', async (req, res) => {
    const { q, minPrice, maxPrice, type, status, page = 1, limit = 10, } = req.query;
    let query = supabase_1.supabaseAdmin
        .from('listings')
        .select('*', { count: 'exact' });
    if (q) {
        query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`);
    }
    if (minPrice)
        query = query.gte('price', Number(minPrice));
    if (maxPrice)
        query = query.lte('price', Number(maxPrice));
    if (type)
        query = query.eq('property_type', type);
    if (status)
        query = query.eq('status', status);
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit) - 1;
    query = query.range(start, end);
    const { data, count, error } = await query;
    if (error)
        return res.status(500).json({ error: error.message });
    res.json({
        data,
        total: count,
        page: Number(page),
        limit: Number(limit),
    });
});
// GET /api/listings/:id — fetch single listing
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase_1.supabaseAdmin
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
    if (error || !data) {
        console.warn(`Listing not found for ID: ${id}`);
        return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(data);
});
// POST /api/listings — create listing (admin only)
router.post('/', requireAuth_1.requireAuth, requireAdmin_1.requireAdmin, async (req, res) => {
    const parse = listingSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: parse.error.issues });
    }
    console.log("Creating listing with:", parse.data); // ✅ Debug log
    const { data, error } = await supabase_1.supabaseAdmin
        .from('listings')
        .insert([parse.data])
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});
// PUT /api/listings/:id — full update (admin only)
router.put('/:id', requireAuth_1.requireAuth, requireAdmin_1.requireAdmin, async (req, res) => {
    const { id } = req.params;
    const parse = listingSchema.safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: parse.error.issues });
    }
    const { data, error } = await supabase_1.supabaseAdmin
        .from('listings')
        .update(parse.data)
        .eq('id', id)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
// PATCH /api/listings/:id — partial update (admin only)
router.patch('/:id', requireAuth_1.requireAuth, requireAdmin_1.requireAdmin, async (req, res) => {
    const { id } = req.params;
    const parse = listingSchema.partial().safeParse(req.body);
    if (!parse.success) {
        return res.status(400).json({ error: parse.error.issues });
    }
    const { data, error } = await supabase_1.supabaseAdmin
        .from('listings')
        .update(parse.data)
        .eq('id', id)
        .select()
        .single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
});
// DELETE /api/listings/:id — delete listing (admin only)
router.delete('/:id', requireAuth_1.requireAuth, requireAdmin_1.requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase_1.supabaseAdmin
        .from('listings')
        .delete()
        .eq('id', id);
    if (error) {
        console.error(`Failed to delete listing ${id}:`, error.message);
        return res.status(500).json({ error: error.message });
    }
    res.status(204).send();
});
exports.default = router;
