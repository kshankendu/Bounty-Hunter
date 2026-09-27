import React from 'react';
import { useGame } from '../../context/GameContext.jsx';

function BonusCard({ bonus, solved, onSubmit }) {
  const [value, setValue] = React.useState('');
  const [msg, setMsg] = React.useState(null);
  const [shake, setShake] = React.useState(false);
  const [flash, setFlash] = React.useState(false);

  if (solved) {
    return (
      <div className="card" style={{ opacity: .7 }}>
        <div className="clue-text" style={{ fontSize: '1rem' }}>{bonus.clue}</div>
        <div className="msg ok" style={{ marginTop: 8 }}>✅ Solved — +{bonus.points} pts banked!</div>
      </div>
    );
  }

  async function handleSubmit() {
    const result = await onSubmit(bonus.id, value);
    if (result.ok === null) return;
    if (result.ok) {
      setFlash(true);
      setMsg({ ok: true, text: result.message });
      setTimeout(() => setFlash(false), 700);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setMsg({ ok: false, text: result.message });
    }
  }

  return (
    <div className={`card${shake ? ' shake' : ''}${flash ? ' flash-ok' : ''}`}>
      <div className="clue-text" style={{ fontSize: '1rem' }}>{bonus.clue}</div>
      <div className="score-pill" style={{ marginTop: 8 }}>+{bonus.points} pts</div>
      <div className="stack" style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Enter the bonus code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button className="btn btn-gold" onClick={handleSubmit}>📷 Submit Bonus Scan</button>
        {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      </div>
    </div>
  );
}

export default function BonusSection() {
  const { myGroup, bonuses, submitBonusScan } = useGame();
  const activeBonuses = bonuses.filter((b) => b.active);
  if (!myGroup || activeBonuses.length === 0) return null;
  const solved = myGroup.solvedBonuses || [];

  return (
    <div id="bonus-section">
      <h2 style={{ marginTop: 18 }}>🎁 Bonus Bounties</h2>
      {activeBonuses.map((b) => (
        <BonusCard key={b.id} bonus={b} solved={solved.includes(b.id)} onSubmit={submitBonusScan} />
      ))}
    </div>
  );
}
