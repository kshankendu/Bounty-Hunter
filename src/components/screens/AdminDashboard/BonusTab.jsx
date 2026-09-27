import React, { useState } from 'react';
import { useGame } from '../../../context/GameContext.jsx';

export default function BonusTab() {
  const { bonuses, groups, pushBonus, toggleBonus, deleteBonus } = useGame();
  const [clue, setClue] = useState('');
  const [clueHi, setClueHi] = useState('');
  const [answer, setAnswer] = useState('');
  const [points, setPoints] = useState('');
  const [status, setStatus] = useState(null);

  async function handlePush() {
  const result = await pushBonus(clue, clueHi, answer, points);
  setStatus(result);
  if (result.ok) {
    setClue('');
    setClueHi('');
    setAnswer('');
    setPoints('');
  }
}

  const ordered = [...bonuses].reverse();

  return (
    <>
      <div className="card stack">
        <div>
          <label>Bonus clue</label>
          <input type="text" placeholder="e.g. Find the red flag and scan it!" value={clue} onChange={(e) => setClue(e.target.value)} />
        </div>
        <div>
          <label>Bonus clue (हिंदी) — optional</label>
          <input type="text" placeholder="e.g. लाल झंडा ढूंढो और स्कैन करो!" value={clueHi} onChange={(e) => setClueHi(e.target.value)} />
        </div>
        <div>
          <label>Correct QR code / answer</label>
          <input type="text" placeholder="e.g. REDFLAG" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        </div>
        <div>
          <label>Bonus points</label>
          <input type="text" inputMode="numeric" placeholder="500" value={points} onChange={(e) => setPoints(e.target.value)} />
        </div>
        <button className="btn btn-gold" onClick={handlePush}>⚡ Push Bonus to All Squads</button>
        {status && <div className={`msg ${status.ok ? 'ok' : 'err'}`}>{status.message}</div>}
      </div>

      <div style={{ marginTop: 14 }}>
        {ordered.length === 0 ? (
          <div className="empty">No bonus bounties yet.</div>
        ) : (
          <div className="grid-2col">
            {ordered.map((b) => {
              const solvedCount = groups.filter((g) => (g.solvedBonuses || []).includes(b.id)).length;
              return (
                <div className="card" key={b.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    {b.active
                      ? <span className="tag" style={{ color: 'var(--lime)' }}>LIVE ⚡</span>
                      : <span className="tag">Inactive</span>}
                    <span className="tag">+{b.points} pts</span>
                    <span className="tag">{solvedCount}/{groups.length} solved</span>
                  </div>
                  <div style={{ fontWeight: 700 }}>{b.clue}</div>
                  <div style={{ fontWeight: 700 }}>{b.clue}{b.clueHi ? ` / ${b.clueHi}` : ''}</div>
                  <div className="mono" style={{ color: 'var(--text-dim)', fontSize: '.8rem', margin: '4px 0 10px' }}>Answer: {b.answer}</div>
                  <div className="btn-row">
                    <button className={`btn ${b.active ? 'btn-ghost' : 'btn-gold'} btn-sm`} onClick={() => toggleBonus(b.id)}>
                      {b.active ? 'Deactivate' : 'Reactivate'}
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => deleteBonus(b.id)}>🗑 Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
