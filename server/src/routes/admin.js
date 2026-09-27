import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const password = req.body.password || '';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'treasure2026';
  res.json({ ok: password === ADMIN_PASS });
});

export default router;
