import React from 'react';
import { useGame } from '../../context/GameContext.jsx';

export default function BonusModal() {
  const { bonusModal, dismissBonus } = useGame();
  return (
    <div className={`modal-overlay${bonusModal.show ? ' show' : ''}`}>
      <div className="modal">
        <div className="bigemoji">🎁</div>
        <h2>Bonus Bounty!</h2>
        <p style={{ fontWeight: 600 }}>{bonusModal.text}</p>
        <button className="btn btn-gold" style={{ marginTop: 10 }} onClick={dismissBonus}>Got it!</button>
      </div>
    </div>
  );
}
