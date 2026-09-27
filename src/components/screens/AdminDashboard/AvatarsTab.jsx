import React, { useState } from 'react';
import { AVATAR_ORDER, AVATAR_IMAGES } from '../../../data/avatars.js';
import { useGame } from '../../../context/GameContext.jsx';

function AvatarCard({ name }) {
  const { avatarClues, groups, addAvatarStage, deleteAvatarStage } = useGame();
  const stages = avatarClues[name] || [];
  const claimedBy = groups.find((g) => g.avatar === name);
  const [clue, setClue] = useState('');
  const [clueHi, setClueHi] = useState('');
  const [answer, setAnswer] = useState('');

  function handleAdd() {
  if (!clue.trim() || !answer.trim()) return;
  addAvatarStage(name, clue, clueHi, answer);
  setClue('');
  setClueHi('');
  setAnswer('');
}

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
        <img className="av-img-lg" src={AVATAR_IMAGES[name] || ''} alt={name} />
        <strong>{name}</strong>
        <span className="tag">{stages.length} stage{stages.length === 1 ? '' : 's'}</span>
        <span className="tag">{claimedBy ? `Claimed by ${claimedBy.name}` : 'Unclaimed'}</span>
      </div>
      <div style={{ borderTop: '1px dashed rgba(255,255,255,.15)', borderBottom: '1px dashed rgba(255,255,255,.15)', marginBottom: 10 }}>
        {stages.length === 0 ? (
          <div className="empty" style={{ padding: '8px 4px' }}>No clues prepped yet.</div>
        ) : (
          stages.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
              <div className="mono" style={{ fontSize: '.78rem', color: 'var(--text-dim)', flex: 1 }}>
                Stage {i + 1}: {s.clue}{s.clueHi ? ` / ${s.clueHi}` : ''}  →  {s.answer}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ width: 'auto', padding: '4px 9px', flex: 'none' }}
                onClick={() => deleteAvatarStage(name, i)}>🗑</button>
            </div>
          ))
        )}
      </div>
      <label>Add next clue for this avatar</label>
      <input type="text" placeholder="Clue text…" style={{ marginBottom: 8 }}
        value={clue} onChange={(e) => setClue(e.target.value)} />
        <input type="text" placeholder="Clue text (हिंदी)… optional" style={{ marginBottom: 8 }}
        value={clueHi} onChange={(e) => setClueHi(e.target.value)} />
      <input type="text" placeholder="Correct QR code / answer" style={{ marginBottom: 8 }}
        value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <button className="btn btn-lime btn-sm" onClick={handleAdd}>➕ Add Clue Stage</button>
    </div>
  );
}

export default function AvatarsTab() {
  return (
    <div className="grid-2col">
      {AVATAR_ORDER.map((name) => <AvatarCard key={name} name={name} />)}
    </div>
  );
}
