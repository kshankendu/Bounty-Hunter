import React, { useState } from 'react';
import { AVATAR_IMAGES } from '../../data/avatars.js';
import { useGame } from '../../context/GameContext.jsx';

export default function ResumeSquad() {
  const { groups, resumeGroup, goTo } = useGame();
  const [selected, setSelected] = useState(null);
  const [confirmName, setConfirmName] = useState('');
  const [error, setError] = useState('');

  function pick(g) {
    setSelected(g);
    setConfirmName('');
    setError('');
  }

  function handleResume() {
    if (!selected) return;
    if (confirmName.trim().toLowerCase() !== selected.name.trim().toLowerCase()) {
      setError('That name doesn\u2019t match — type your squad name exactly to confirm it\u2019s you.');
      return;
    }
    resumeGroup(selected.id);
  }

  return (
    <section id="screen-resume" className="screen active">
      <h1>Resume your squad 🔁</h1>
      <p className="sub">Lost your session? Find your squad below and confirm its name to hop back in.</p>

      {groups.length === 0 ? (
        <div className="empty">No squads registered yet.</div>
      ) : (
        <div className="stack">
          {groups.map((g) => (
            <div
              key={g.id}
              className={`card${selected?.id === g.id ? ' selected' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                borderColor: selected?.id === g.id ? 'var(--lime)' : undefined,
                marginBottom: 0
              }}
              onClick={() => pick(g)}
            >
              <img className="av-img-lg" src={AVATAR_IMAGES[g.avatar] || ''} alt={g.avatar} />
              <strong style={{ flex: 1 }}>{g.name}</strong>
              {selected?.id === g.id && <span className="tag">Selected</span>}
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="card stack" style={{ marginTop: 14 }}>
          <label>Type "{selected.name}" to confirm this is your squad</label>
          <input
            type="text"
            placeholder="Squad name"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResume()}
          />
          <button className="btn btn-lime" onClick={handleResume}>✅ Resume Hunting</button>
          {error && <div className="msg err">{error}</div>}
        </div>
      )}

      <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => goTo('home')}>← Back</button>
    </section>
  );
}