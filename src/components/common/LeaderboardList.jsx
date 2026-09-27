import React from 'react';
import { AVATAR_IMAGES } from '../../data/avatars.js';
import { useGame } from '../../context/GameContext.jsx';

/**
 * maskNames: true = players only see rank + points (identities hidden,
 * mystery-hunter style); their own squad still shows name/avatar so they can
 * find themselves. Admin view (and the final reveal once the game ends)
 * always passes false so everyone's identity is unmasked.
 */
export default function LeaderboardList({ maskNames }) {
  const { groups, myGroupId } = useGame();
  const sorted = [...groups].sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    return <div className="empty">No squads yet — the board is empty 🏜️</div>;
  }

  return (
    <div>
      {sorted.map((g, i) => {
        const rankCls = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1;
        const isMe = maskNames && g.id === myGroupId;
        const hide = maskNames && !isMe;
        return (
          <div key={g.id} className={`lb-row ${rankCls}${isMe ? ' is-you' : ''}`}>
            <div className="lb-rank">{medal}</div>
            {hide
              ? <div className="lb-av-mystery">🕵️</div>
              : <img className="lb-av" src={AVATAR_IMAGES[g.avatar] || ''} alt="" />}
            <div className={`lb-name${hide ? ' lb-name-mystery' : ''}`}>
              {hide ? 'Mystery Hunter' : (<>{g.name}{isMe && <span className="tag" style={{ marginLeft: 4 }}>You</span>}</>)}
            </div>
            <div className="lb-score">{g.score} pts</div>
          </div>
        );
      })}
    </div>
  );
}
