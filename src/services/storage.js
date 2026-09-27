/**
 * Data access layer for the Bounty Hunter game.
 *
 * Shared game data (groups, avatar clues, bonuses, game state) now lives in
 * MongoDB behind the Express API in /server — every function below talks to
 * it over fetch(). Only per-device bookkeeping (which squad this browser is,
 * which bonuses/game-end popups it has already seen) stays in localStorage,
 * since that's inherently local to one device and was never meant to sync.
 *
 * This is deliberately localStorage, not sessionStorage: sessionStorage is
 * cleared the moment the tab/browser actually closes (and mobile browsers
 * often discard background tabs long before that), which used to log
 * players out of their own squad mid-hunt with no way back in. localStorage
 * survives closing the browser and reopening it, so the same phone just
 * resumes where it left off.
 */

const API_BASE = '/api';

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok && res.status >= 500) {
    throw new Error(`Request to ${path} failed with ${res.status}`);
  }
  return res.json();
}

/* ---------- groups (squads) ---------- */
export function getGroups() {
  return request('/groups');
}
export function registerTeam(name, avatar) {
  return request('/groups', { method: 'POST', body: JSON.stringify({ name, avatar }) });
}
export function passClue(id) {
  return request(`/groups/${id}/pass`, { method: 'PATCH' });
}
export function removeGroup(id) {
  return request(`/groups/${id}`, { method: 'DELETE' });
}
export function submitScan(id, value) {
  return request(`/groups/${id}/scan`, { method: 'POST', body: JSON.stringify({ value }) });
}
export function submitBonusScan(id, bonusId, value) {
  return request(`/groups/${id}/bonus-scan`, { method: 'POST', body: JSON.stringify({ bonusId, value }) });
}

/* ---------- avatar clue templates ---------- */
export function getAvatarClues() {
  return request('/avatar-clues');
}
export function addAvatarStage(avatarName, clue, answer) {
  return request(`/avatar-clues/${encodeURIComponent(avatarName)}`, {
    method: 'POST',
    body: JSON.stringify({ clue, answer })
  });
}
export function deleteAvatarStage(avatarName, index) {
  return request(`/avatar-clues/${encodeURIComponent(avatarName)}/${index}`, { method: 'DELETE' });
}
export function stagesFor(avatarName, avatarClues) {
  const clues = avatarClues || {};
  return clues[avatarName] || [];
}

/* ---------- bonus bounties ---------- */
export function getBonuses() {
  return request('/bonuses');
}
export function pushBonus(clue, answer, points) {
  return request('/bonuses', { method: 'POST', body: JSON.stringify({ clue, answer, points }) });
}
export function toggleBonus(id) {
  return request(`/bonuses/${id}/toggle`, { method: 'PATCH' });
}
export function deleteBonus(id) {
  return request(`/bonuses/${id}`, { method: 'DELETE' });
}

/* ---------- game state (started/ended) ---------- */
export function getGameState() {
  return request('/game-state');
}
export function endGame() {
  return request('/game-state/end', { method: 'POST' });
}
export function reopenGame() {
  return request('/game-state/reopen', { method: 'POST' });
}

/* ---------- admin auth ---------- */
export function adminLogin(password) {
  return request('/admin/login', { method: 'POST', body: JSON.stringify({ password }) })
    .then((r) => r.ok);
}

/* ================= per-device only (unchanged, still local) ================= */

const KEYS = {
  myGroup: 'bh_my_group',
  seenBonusIds: 'bh_seen_bonus_ids',
  seenGameEnd: 'bh_seen_game_end'
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------- "my squad" (this browser/device) ---------- */
export function myGroupId() {
  return localStorage.getItem(KEYS.myGroup);
}
export function setMyGroupId(id) {
  localStorage.setItem(KEYS.myGroup, id);
}
export function clearMyGroupId() {
  localStorage.removeItem(KEYS.myGroup);
}

/* ---------- notification "seen" bookkeeping (per-device) ---------- */
export function getSeenBonusIds() {
  return readJSON(KEYS.seenBonusIds, []);
}
export function setSeenBonusIds(ids) {
  writeJSON(KEYS.seenBonusIds, ids);
}
export function getSeenGameEnd() {
  return localStorage.getItem(KEYS.seenGameEnd);
}
export function setSeenGameEnd(value) {
  localStorage.setItem(KEYS.seenGameEnd, String(value));
}