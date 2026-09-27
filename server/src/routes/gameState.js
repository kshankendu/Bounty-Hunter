import { Router } from 'express';
import GameState, { getOrCreateGameState } from '../models/GameState.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const state = await getOrCreateGameState();
    res.json({ ended: state.ended, endedAt: state.endedAt });
  } catch (err) {
    next(err);
  }
});

router.post('/end', async (_req, res, next) => {
  try {
    const endedAt = Date.now();
    await getOrCreateGameState();
    const state = await GameState.findOneAndUpdate(
      { singletonKey: 'game' },
      { ended: true, endedAt },
      { new: true }
    );
    res.json({ ended: state.ended, endedAt: state.endedAt });
  } catch (err) {
    next(err);
  }
});

router.post('/reopen', async (_req, res, next) => {
  try {
    await getOrCreateGameState();
    const state = await GameState.findOneAndUpdate(
      { singletonKey: 'game' },
      { ended: false, endedAt: null },
      { new: true }
    );
    res.json({ ended: state.ended, endedAt: state.endedAt });
  } catch (err) {
    next(err);
  }
});

export default router;
