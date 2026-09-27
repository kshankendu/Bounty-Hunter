import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';

export default function AdminLogin() {
  const { adminLogin, goTo } = useGame();
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  async function handleLogin() {
    if (await adminLogin(pass)) {
      setError('');
      setPass('');
      goTo('admin');
    } else {
      setError('Wrong password, try again 🙃');
    }
  }

  return (
    <section id="screen-admin-login" className="screen active">
      <h1>Admin access 🔐</h1>
      <p className="sub">Game masters only.</p>
      <div className="card stack">
        <div>
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>
        <button className="btn btn-magenta" onClick={handleLogin}>Unlock Dashboard</button>
        {error && <div className="msg err">{error}</div>}
      </div>
    </section>
  );
}
