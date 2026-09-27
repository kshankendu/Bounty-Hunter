import React from 'react';
import { useGame } from '../../context/GameContext.jsx';

export default function GameEndModal() {
  const { gameEndModal, dismissGameEnd } = useGame();
  return (
    <div className={`modal-overlay${gameEndModal.show ? ' show' : ''}`}>
      <div className="modal">
        <div className="bigemoji">{gameEndModal.emoji}</div>
        <h2>{gameEndModal.title}</h2>
        <p style={{ fontWeight: 600 }}>{gameEndModal.text}</p>
        <button className="btn btn-gold" style={{ marginTop: 10 }} onClick={dismissGameEnd}>See Final Leaderboard</button>
      </div>
    </div>
  );
}
