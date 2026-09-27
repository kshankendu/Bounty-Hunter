import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as store from '../services/storage.js';
import { launchConfetti } from '../utils/confetti.js';

const GameContext = createContext(null);

export function useGame() {
  return useContext(GameContext);
}

export function GameProvider({ children }) {
  // ---------- core data (now fetched from the Express + MongoDB API; polling
  // simulates live multi-device sync until websockets replace it) ----------
  const [groups, setGroups] = useState([]);
  const [avatarClues, setAvatarClues] = useState({});
  const [bonuses, setBonuses] = useState([]);
  const [gameState, setGameState] = useState({ ended: false, endedAt: null });
  const [myGroupId, setMyGroupIdState] = useState(() => store.myGroupId());
  const [loaded, setLoaded] = useState(false);

  // ---------- navigation ----------
  const [screen, setScreen] = useState(() => (store.myGroupId() ? 'clue' : 'home'));

  // ---------- modals ----------
  const [confirmModal, setConfirmModal] = useState({ show: false, message: '', onYes: null });
  const [bonusModal, setBonusModal] = useState({ show: false, text: '' });
  const [gameEndModal, setGameEndModal] = useState({ show: false, emoji: '🏁', title: '', text: '' });

  const refresh = useCallback(async () => {
    const [gs, ac, bs, state] = await Promise.all([
      store.getGroups(),
      store.getAvatarClues(),
      store.getBonuses(),
      store.getGameState()
    ]);
    setGroups(gs);
    setAvatarClues(ac);
    setBonuses(bs);
    setGameState(state);
    return { groups: gs, avatarClues: ac, bonuses: bs, gameState: state };
  }, []);

  const goTo = useCallback(async (id) => {
    await refresh();
    setScreen(id);
  }, [refresh]);
  const goHome = useCallback(() => goTo('home'), [goTo]);

  /* ---------- confirm popup (replaces window.confirm) ---------- */
  const requestConfirm = useCallback((message, onYes) => {
    setConfirmModal({ show: true, message, onYes });
  }, []);
  const confirmYes = useCallback(() => {
    const cb = confirmModal.onYes;
    setConfirmModal({ show: false, message: '', onYes: null });
    if (cb) cb();
  }, [confirmModal]);
  const confirmNo = useCallback(() => {
    setConfirmModal({ show: false, message: '', onYes: null });
  }, []);

  /* ---------- bonus heads-up popup ---------- */
  const checkBonusNotify = useCallback((bonusList) => {
    if (!store.myGroupId()) return;
    const activeBonuses = bonusList.filter((b) => b.active);
    const seen = store.getSeenBonusIds();
    const unseen = activeBonuses.filter((b) => !seen.includes(b.id));
    if (unseen.length > 0) {
      const text = unseen.length === 1
        ? `A new bonus bounty just dropped — head to your clue screen to scan for +${unseen[0].points} pts!`
        : `${unseen.length} new bonus bounties just dropped — check your clue screen!`;
      setBonusModal({ show: true, text });
    }
  }, []);
  const dismissBonus = useCallback(() => {
    store.setSeenBonusIds(bonuses.filter((b) => b.active).map((b) => b.id));
    setBonusModal({ show: false, text: '' });
  }, [bonuses]);

  /* ---------- game-over heads-up popup ---------- */
  const showGameEndPopup = useCallback((id, groupList) => {
    const sorted = [...groupList].sort((a, b) => b.score - a.score);
    const idx = sorted.findIndex((g) => g.id === id);
    if (idx === -1) return;
    //if (idx === -1) return false;
    const g = sorted[idx];
    const rank = idx + 1;
    if (rank === 1) {
      setGameEndModal({ show: true, emoji: '🏆', title: 'CHAMPIONS!', text: `${g.name}, you took 1st place with ${g.score} pts! Legendary hunt. 🎉` });
      launchConfetti(160);
    } else if (rank === 2) {
      setGameEndModal({ show: true, emoji: '🥈', title: '2nd Place!', text: `${g.name}, you finished 2nd with ${g.score} pts! So close to gold. 🎊` });
      launchConfetti(110);
    } else if (rank === 3) {
      setGameEndModal({ show: true, emoji: '🥉', title: '3rd Place!', text: `${g.name}, you finished 3rd with ${g.score} pts! Great hunting out there. 🎊` });
      launchConfetti(80);
    } else {
      setGameEndModal({ show: true, emoji: '🕵️', title: 'Game Over!', text: `${g.name}, the hunt has ended — you scored ${g.score} pts. Every clue you cracked mattered. Well played! 💪` });
    }
  }, []);
  const checkGameEndNotify = useCallback((state, groupList) => {
    const id = store.myGroupId();
    if (!id) return;
    if (!state.ended) return;
    const seen = store.getSeenGameEnd();
    if (seen === String(state.endedAt)) return;
    store.setSeenGameEnd(state.endedAt);
    showGameEndPopup(id, groupList);
    //const shown = showGameEndPopup(id, groupList);
    //if (shown) store.setSeenGameEnd(state.endedAt);
  }, [showGameEndPopup]);
  const dismissGameEnd = useCallback(() => {
    setGameEndModal((m) => ({ ...m, show: false }));
    goTo('leaderboard');
  }, [goTo]);

  /* ---------- polling loop: keeps every screen "live" ---------- */
  useEffect(() => {
    let cancelled = false;

    async function tick() {
      const data = await refresh();
      if (cancelled) return;
      checkBonusNotify(data.bonuses);
      checkGameEndNotify(data.gameState, data.groups);
    }

    (async () => {
      await tick();
      if (!cancelled) setLoaded(true);
    })();

    const timer = setInterval(tick, 1500);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= mutators ================= */

  // ---- admin ----
  const adminLogin = useCallback((password) => store.adminLogin(password), []);

  // ---- avatar clue templates ----
  const addAvatarStage = useCallback(async (avatarName, clue, answer) => {
    if (!clue.trim() || !answer.trim()) return;
    const res = await store.addAvatarStage(avatarName, clue, answer);
    if (res.ok) setAvatarClues(res.avatarClues);
  }, []);
  const deleteAvatarStage = useCallback((avatarName, index) => {
    requestConfirm(
      `Remove Stage ${index + 1} for ${avatarName}? Squads who already solved it keep their score, but if a squad hasn't reached it yet, the stages after it will shift up one.`,
      async () => {
        const res = await store.deleteAvatarStage(avatarName, index);
        if (res.ok) setAvatarClues(res.avatarClues);
      }
    );
  }, [requestConfirm]);

  // ---- groups (admin side) ----
  const passClue = useCallback(async (id) => {
    const res = await store.passClue(id);
    if (res.ok) setGroups((gs) => gs.map((g) => (g.id === res.group.id ? res.group : g)));
  }, []);
  const removeGroup = useCallback((id) => {
    const g = groups.find((x) => x.id === id);
    if (!g) return;
    requestConfirm(`Remove "${g.name}" from the hunt? This can't be undone.`, async () => {
      await store.removeGroup(id);
      setGroups((gs) => gs.filter((x) => x.id !== id));
    });
  }, [groups, requestConfirm]);

  // ---- bonuses (admin side) ----
  const pushBonus = useCallback(async (clue, answer, pointsRaw) => {
    if (!clue.trim() || !answer.trim()) return { ok: false, message: 'Fill in the bonus clue and answer.' };
    const res = await store.pushBonus(clue, answer, pointsRaw);
    if (res.ok) setBonuses((bs) => [...bs, res.bonus]);
    return res;
  }, []);
  const toggleBonus = useCallback(async (id) => {
    const res = await store.toggleBonus(id);
    if (res.ok) setBonuses((bs) => bs.map((b) => (b.id === res.bonus.id ? res.bonus : b)));
  }, []);
  const deleteBonus = useCallback((id) => {
    requestConfirm('Delete this bonus bounty permanently?', async () => {
      await store.deleteBonus(id);
      setBonuses((bs) => bs.filter((b) => b.id !== id));
    });
  }, [requestConfirm]);

  // ---- game state (admin side) ----
  const endGame = useCallback(() => {
    requestConfirm('End the game for everyone? All squads will be locked out and shown the final results right now.', async () => {
      const state = await store.endGame();
      setGameState(state);
    });
  }, [requestConfirm]);
  const reopenGame = useCallback(() => {
    requestConfirm('Reopen the game? Squads will be able to keep hunting for clues.', async () => {
      const state = await store.reopenGame();
      setGameState(state);
    });
  }, [requestConfirm]);

  // ---- register (player side) ----
  const registerTeam = useCallback(async (name, avatar) => {
    const res = await store.registerTeam(name, avatar);
    if (res.ok) {
      setGroups((gs) => [...gs, res.group]);
      store.setMyGroupId(res.group.id);
      setMyGroupIdState(res.group.id);
      const freshBonuses = await store.getBonuses();
      store.setSeenBonusIds(freshBonuses.filter((b) => b.active).map((b) => b.id));
    } else if (res.avatarTaken) {
      setGroups(await store.getGroups());
    }
    return res;
  }, []);

  // ---- clue / scanning (player side) ----
  const myGroup = groups.find((g) => g.id === myGroupId) || null;

  const submitScan = useCallback(async (value) => {
    if (!myGroupId) return { ok: false };
    if (!value.trim()) return { ok: null };
    const res = await store.submitScan(myGroupId, value);
    if (res.ok) setGroups((gs) => gs.map((g) => (g.id === res.group.id ? res.group : g)));
    return res;
  }, [myGroupId]);

  const submitBonusScan = useCallback(async (bonusId, value) => {
    if (!myGroupId) return { ok: false };
    if (!value.trim()) return { ok: null };
    const res = await store.submitBonusScan(myGroupId, bonusId, value);
    if (res.ok && res.group) setGroups((gs) => gs.map((g) => (g.id === res.group.id ? res.group : g)));
    return res;
  }, [myGroupId]);

  // If our own squad gets removed by the admin while we're mid-hunt, boot us
  // back to registration (mirrors the original renderClue() guard). Gated on
  // `loaded` so we don't bounce the player before the first fetch resolves.
  useEffect(() => {
    if (loaded && screen === 'clue' && myGroupId && !myGroup) {
      store.clearMyGroupId();
      setMyGroupIdState(null);
      setScreen('register');
    }
  }, [loaded, screen, myGroupId, myGroup]);

  const value = {
    groups, avatarClues, bonuses, gameState, myGroupId, myGroup, loaded,
    screen, goTo, goHome,
    confirmModal, confirmYes, confirmNo,
    bonusModal, dismissBonus,
    gameEndModal, dismissGameEnd,
    adminLogin,
    addAvatarStage, deleteAvatarStage,
    passClue, removeGroup,
    pushBonus, toggleBonus, deleteBonus,
    endGame, reopenGame,
    registerTeam,
    submitScan, submitBonusScan,
    refresh
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
