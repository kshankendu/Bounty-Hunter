import React, { useState } from 'react';
import { AVATAR_ORDER, AVATAR_IMAGES, NAME_SUGGEST } from '../../data/avatars.js';
import { MAX_GROUPS } from '../../data/constants.js';
import { useGame } from '../../context/GameContext.jsx';

export default function Register() {
  const { groups, registerTeam, goTo } = useGame();
  const [name, setName] = useState('');
  const [nameAutoFilled, setNameAutoFilled] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState(null); // { ok: bool, text: string }

  const taken = new Set(groups.map((g) => g.avatar));

  function pickAvatar(av) {
    if (taken.has(av)) return;
    setAvatar(av);
    const suggestion = NAME_SUGGEST[av] || av;
    if (!name.trim() || nameAutoFilled) {
      setName(suggestion);
      setNameAutoFilled(true);
    }
    setMsg({ ok: true, text: `Nice pick! Suggested squad name: "${suggestion}" — tweak it if you like ✏️` });
  }

  async function handleSubmit() {
    const result = await registerTeam(name, avatar);
    if (!result.ok) {
      setMsg({ ok: false, text: result.message });
      return;
    }
    setMsg({ ok: true, text: result.message });
    setTimeout(() => goTo('clue'), 500);
  }

  return (
    <section id="screen-register" className="screen active">
      <h1>Squad sign-up 👥</h1>
      <p className="sub">Pick a name, claim an avatar. <span className="slots">{groups.length}/{MAX_GROUPS} slots filled</span></p>
      <div className="card stack">
        <div>
          <label>Team name</label>
          <input
            type="text"
            placeholder="e.g. The Map Goblins"
            maxLength={24}
            value={name}
            onChange={(e) => { setName(e.target.value); setNameAutoFilled(false); }}
          />
        </div>
        <div>
          <label>Choose your avatar (one per team!)</label>
          <div className="avatar-grid">
            {AVATAR_ORDER.map((av) => (
              <div
                key={av}
                className={`avatar${taken.has(av) ? ' taken' : ''}${avatar === av ? ' selected' : ''}`}
                onClick={() => pickAvatar(av)}
              >
                <img src={AVATAR_IMAGES[av]} alt={av} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-lime" onClick={handleSubmit}>🚀 Start Hunting</button>
        {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
      </div>
    </section>
  );
}
