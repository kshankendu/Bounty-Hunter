import { Router } from 'express';
import Bonus from '../models/Bonus.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await Bonus.find().sort({ createdAt: 1 }));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const clue = (req.body.clue || '').trim();
    const clueHi = (req.body.clueHi || '').trim();
    const answer = (req.body.answer || '').trim();
    if (!clue || !answer) {
      return res.json({ ok: false, message: 'Fill in the bonus clue and answer.' });
    }
    const pointsVal = parseInt(req.body.points, 10);
    const points = Number.isNaN(pointsVal) || pointsVal <= 0 ? 500 : pointsVal;

    const bonus = await Bonus.create({ clue, clueHi, answer, points, active: true });
    res.json({ ok: true, message: 'Bonus is LIVE ⚡ — squads will be notified.', bonus });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/toggle', async (req, res, next) => {
  try {
    const bonus = await Bonus.findById(req.params.id);
    if (!bonus) return res.status(404).json({ ok: false, message: 'Bonus not found.' });
    bonus.active = !bonus.active;
    await bonus.save();
    res.json({ ok: true, bonus });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Bonus.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
