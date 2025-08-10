import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { z } from 'zod';

const router = Router();

// ✅ Updated Zod schema with coordinates
const listingSchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  price: z.number(),
  property_type: z.enum(['Apartment', 'House', 'Commercial']),
  status: z.enum(['For Sale', 'For Rent']),
  images: z.array(z.string()).optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

// GET /api/listings — search, filter, paginate
router.get('/', async (req: Request, res: Response) => {
  const {
    q,
    minPrice,
    maxPrice,
    type,
    status,
    page = 1,
    limit = 10,
  } = req.query;

  let query = supabaseAdmin
    .from('listings')
    .select('*', { count: 'exact' });

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`
    );
  }

  if (minPrice) query = query.gte('price', Number(minPrice));
  if (maxPrice) query = query.lte('price', Number(maxPrice));
  if (type) query = query.eq('property_type', type);
  if (status) query = query.eq('status', status);

  const start = (Number(page) - 1) * Number(limit);
  const end = start + Number(limit) - 1;
  query = query.range(start, end);

  const { data, count, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json({
    data,
    total: count,
    page: Number(page),
    limit: Number(limit),
  });
});

// GET /api/listings/:id — fetch single listing
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
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
router.post('/', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const parse = listingSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.issues });
  }

  console.log("Creating listing with:", parse.data); // ✅ Debug log

  const { data, error } = await supabaseAdmin
    .from('listings')
    .insert([parse.data])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json(data);
});

// PUT /api/listings/:id — full update (admin only)
router.put('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const parse = listingSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.issues });
  }

  const { data, error } = await supabaseAdmin
    .from('listings')
    .update(parse.data)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// PATCH /api/listings/:id — partial update (admin only)
router.patch('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const parse = listingSchema.partial().safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.issues });
  }

  const { data, error } = await supabaseAdmin
    .from('listings')
    .update(parse.data)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// DELETE /api/listings/:id — delete listing (admin only)
router.delete('/:id', requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabaseAdmin
    .from('listings')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Failed to delete listing ${id}:`, error.message);
    return res.status(500).json({ error: error.message });
  }

  res.status(204).send();
});

export default router;
