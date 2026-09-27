import { Router } from 'express';
import Group from '../models/Group.js';
import AvatarClue from '../models/AvatarClue.js';
import Bonus from '../models/Bonus.js';
import { getOrCreateGameState } from '../models/GameState.js';

const MAX_GROUPS = 20;
const SCAN_POINTS = 1000;

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const groups = await Group.find().sort({ createdAt: 1 });
    res.json(groups);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    const avatar = req.body.avatar;

    const count = await Group.countDocuments();
    if (count >= MAX_GROUPS) {
      return res.json({ ok: false, message: 'All 20 squad slots are full! 🏁' });
    }
    if (!name) {
      return res.json({ ok: false, message: 'Give your squad a name!' });
    }
    if (!avatar) {
      return res.json({ ok: false, message: 'Pick an avatar!' });
    }

    const nameClash = await Group.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, 'i') });
    if (nameClash) {
      return res.json({ ok: false, message: "That name is already taken. If it's yours from an earlier session, use \u201cResume Your Squad\u201d on the home screen instead of registering again 😏" });
    }
    const avatarClash = await Group.findOne({ avatar });
    if (avatarClash) {
      return res.json({ ok: false, message: 'Someone just grabbed that avatar — pick another!', avatarTaken: true });
    }

    const group = await Group.create({ name, avatar, score: 0, stageIndex: 0, passed: [], solvedBonuses: [] });
    res.json({ ok: true, message: 'Squad locked in! Good luck out there 🍀', group });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/pass', async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ ok: false, message: 'Squad not found.' });
    const clueDoc = await AvatarClue.findOne({ avatar: group.avatar });
    const stages = clueDoc ? clueDoc.stages : [];
    if (group.stageIndex >= stages.length) return res.json({ ok: false, group });
    group.passed.push(group.stageIndex);
    group.stageIndex += 1;
    await group.save();
    res.json({ ok: true, group });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/scan', async (req, res, next) => {
  try {
    const state = await getOrCreateGameState();
    if (state.ended) return res.json({ ok: false, message: 'The hunt has ended.' });

    const value = (req.body.value || '');
    if (!value.trim()) return res.json({ ok: null });

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ ok: false, message: 'Squad not found.' });

    const clueDoc = await AvatarClue.findOne({ avatar: group.avatar });
    const stages = clueDoc ? clueDoc.stages : [];
    const stage = stages[group.stageIndex];
    if (!stage) return res.json({ ok: false, message: 'No clue to scan for yet.' });

    if (value.trim().toLowerCase() !== stage.answer.toLowerCase()) {
      return res.json({ ok: false, message: 'Wrong code — scan again! ❌' });
    }

    // Optimistic guard: only apply if the group's stage hasn't moved since we read it
    // (avoids double-scoring if two requests for the same squad race each other).
    const updated = await Group.findOneAndUpdate(
      { _id: group._id, stageIndex: group.stageIndex },
      { $inc: { score: SCAN_POINTS, stageIndex: 1 } },
      { new: true }
    );
    if (!updated) return res.json({ ok: false, message: 'Wrong code — scan again! ❌' });

    res.json({ ok: true, message: `Correct! +${SCAN_POINTS} pts 🎉`, group: updated });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/bonus-scan', async (req, res, next) => {
  try {
    const state = await getOrCreateGameState();
    if (state.ended) return res.json({ ok: false, message: 'The hunt has ended.' });

    const { bonusId, value } = req.body;
    if (!(value || '').trim()) return res.json({ ok: null });

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ ok: false, message: 'Squad not found.' });

    const bonus = await Bonus.findById(bonusId);
    if (!bonus || !bonus.active) return res.json({ ok: false, message: 'This bonus is no longer active.' });

    if (value.trim().toLowerCase() !== bonus.answer.toLowerCase()) {
      return res.json({ ok: false, message: 'Not quite — try again ❌' });
    }
    if ((group.solvedBonuses || []).includes(String(bonus._id))) {
      return res.json({ ok: true, message: `Bonus cracked! +${bonus.points} pts 🎉`, group });
    }

    const updated = await Group.findOneAndUpdate(
      { _id: group._id, solvedBonuses: { $ne: String(bonus._id) } },
      { $inc: { score: bonus.points }, $push: { solvedBonuses: String(bonus._id) } },
      { new: true }
    );
    const finalGroup = updated || group;

    res.json({ ok: true, message: `Bonus cracked! +${bonus.points} pts 🎉`, group: finalGroup });
  } catch (err) {
    next(err);
  }
});

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default router;
