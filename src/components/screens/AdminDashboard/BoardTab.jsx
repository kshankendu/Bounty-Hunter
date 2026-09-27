import React from 'react';
import { useGame } from '../../../context/GameContext.jsx';
import LeaderboardList from '../../common/LeaderboardList.jsx';

export default function BoardTab() {
  const { gameState, endGame, reopenGame } = useGame();

  return (
    <>
      <div className="card" style={{ marginBottom: 14 }}>
        {gameState.ended ? (
          <>
            <div className="msg ok" style={{ marginTop: 0 }}>🏁 Game ended — final results are showing on every squad's screen.</div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 10 }} onClick={reopenGame}>↩️ Reopen Game</button>
          </>
        ) : (
          <>
            <p className="sub" style={{ margin: '0 0 10px' }}>Ending the game locks all squads out of scanning and shows everyone a results popup.</p>
            <button className="btn btn-magenta btn-sm" onClick={endGame}>🏁 End Game for Everyone</button>
          </>
        )}
      </div>
      <LeaderboardList maskNames={false} />
    </>
  );
}
