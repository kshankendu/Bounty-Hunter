import { Router } from 'express';
import AvatarClue from '../models/AvatarClue.js';

const router = Router();

async function cluesAsMap() {
  const docs = await AvatarClue.find();
  const map = {};
  for (const doc of docs) {
    map[doc.avatar] = doc.stages.map((s) => ({ clue: s.clue, clueHi: s.clueHi, answer: s.answer }));
  }
  return map;
}

router.get('/', async (_req, res, next) => {
  try {
    res.json(await cluesAsMap());
  } catch (err) {
    next(err);
  }
});

router.post('/:avatar', async (req, res, next) => {
  try {
    const { clue, clueHi, answer } = req.body;
    if (!clue?.trim() || !answer?.trim()) {
      return res.json({ ok: false, message: 'Clue and answer are required.' });
    }
    const avatar = req.params.avatar;
    let doc = await AvatarClue.findOne({ avatar });
    if (!doc) doc = new AvatarClue({ avatar, stages: [] });
    doc.stages.push({ clue: clue.trim(), clueHi: (clueHi || '').trim(), answer: answer.trim() });
    await doc.save();
    res.json({ ok: true, avatarClues: await cluesAsMap() });
  } catch (err) {
    next(err);
  }
});

router.delete('/:avatar/:index', async (req, res, next) => {
  try {
    const avatar = req.params.avatar;
    const index = parseInt(req.params.index, 10);
    const doc = await AvatarClue.findOne({ avatar });
    if (!doc || index < 0 || index >= doc.stages.length) {
      return res.json({ ok: true, avatarClues: await cluesAsMap() });
    }
    doc.stages.splice(index, 1);
    await doc.save();
    res.json({ ok: true, avatarClues: await cluesAsMap() });
  } catch (err) {
    next(err);
  }
});

export default router;
