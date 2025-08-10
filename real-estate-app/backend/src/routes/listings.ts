import { Router } from 'express';

const router = Router();

router.get('/', (_, res) => {
  res.json({ message: 'Listings endpoint works!' });
});

export default router;
