import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { z } from 'zod';

const router = Router();

const uploadSchema = z.object({
  filename: z.string()
});

router.post('/url', requireAuth, requireAdmin, async (req, res) => {
  const parse = uploadSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues });

  const { filename } = parse.data;
  const bucket = 'listing-images';

  const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`;

  res.json({ publicUrl });
});

export default router;
