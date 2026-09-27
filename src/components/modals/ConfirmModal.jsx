import React from 'react';
import { useGame } from '../../context/GameContext.jsx';

export default function ConfirmModal() {
  const { confirmModal, confirmYes, confirmNo } = useGame();
  return (
    <div className={`modal-overlay${confirmModal.show ? ' show' : ''}`}>
      <div className="modal">
        <div className="bigemoji">⚠️</div>
        <h2>Are you sure?</h2>
        <p style={{ fontWeight: 600 }}>{confirmModal.message}</p>
        <div className="btn-row" style={{ marginTop: 14 }}>
          <button className="btn btn-ghost btn-sm" onClick={confirmNo}>Cancel</button>
          <button className="btn btn-magenta btn-sm" onClick={confirmYes}>Yes, do it</button>
        </div>
      </div>
    </div>
  );
}
