import React from 'react';
import { AVATAR_IMAGES } from '../../../data/avatars.js';
import { useGame } from '../../../context/GameContext.jsx';

export default function GroupsTab() {
  const { groups, avatarClues, passClue, removeGroup } = useGame();

  if (groups.length === 0) {
    return <div className="empty">No squads yet. Share the join link! 📣</div>;
  }

  return (
    <div className="grid-2col">
      {groups.map((g) => {
        const stages = avatarClues[g.avatar] || [];
        const finished = stages.length > 0 && g.stageIndex >= stages.length;
        const stageTag = finished ? 'Finished 🏁' : `Stage ${g.stageIndex + 1}/${stages.length || 0}`;
        const passDisabled = finished || stages.length === 0;
        return (
          <div className="card" key={g.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <img className="av-img-lg" src={AVATAR_IMAGES[g.avatar] || ''} alt={g.avatar} />
              <strong>{g.name}</strong>
              <span className="tag">{g.avatar} clues</span>
              <span className="tag">{stageTag}</span>
              <span className="tag">⭐ {g.score}</span>
              {g.passed && g.passed.length > 0 && <span className="tag">⏭ {g.passed.length} passed</span>}
            </div>
            <div className="btn-row">
              <button className="btn btn-gold btn-sm" disabled={passDisabled} onClick={() => passClue(g.id)}>⏭ Pass Clue</button>
              <button className="btn btn-ghost btn-sm" onClick={() => removeGroup(g.id)}>🗑 Remove Squad</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
