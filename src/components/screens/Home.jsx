import React from 'react';
import { useGame } from '../../context/GameContext.jsx';

export default function Home() {
  const { myGroup, goTo } = useGame();
  return (
    <section id="screen-home" className="screen active">
      <h1>Ready to hunt? 🔍</h1>
      <p className="sub">Scan. Solve. Sprint to the top of the board.</p>
      <div className="stack">
        {myGroup ? (
          <button className="btn btn-lime" onClick={() => goTo('clue')}>🔍 Continue Hunting</button>
        ) : (
          <button className="btn btn-lime" onClick={() => goTo('register')}>🎒 Join the Hunt</button>
        )}
        <button className="btn btn-cyan" onClick={() => goTo('leaderboard')}>🏆 View Leaderboard</button>
        <button className="btn btn-ghost" onClick={() => goTo('admin-login')}>🛠️ Admin Login</button>
      </div>
    </section>
  );
}
