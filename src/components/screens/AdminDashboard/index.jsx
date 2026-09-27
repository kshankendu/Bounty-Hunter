import React, { useState } from 'react';
import { useGame } from '../../../context/GameContext.jsx';
import { MAX_GROUPS } from '../../../data/constants.js';
import AvatarsTab from './AvatarsTab.jsx';
import GroupsTab from './GroupsTab.jsx';
import BonusTab from './BonusTab.jsx';
import BoardTab from './BoardTab.jsx';

const TABS = [
  { id: 't-avatars', label: 'Avatars' },
  { id: 't-groups', label: 'Groups' },
  { id: 't-bonus', label: 'Bonus' },
  { id: 't-board', label: 'Leaderboard' }
];

export default function AdminDashboard() {
  const { groups, goHome } = useGame();
  const [tab, setTab] = useState('t-avatars');

  return (
    <section id="screen-admin" className="screen active">
      <h1>Game Master HQ 🧭</h1>
      <p className="sub">{groups.length}/{MAX_GROUPS} squads registered</p>
      <div className="tabs">
        {TABS.map((t) => (
          <div
            key={t.id}
            className={`tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div className={`tabpane${tab === 't-avatars' ? ' active' : ''}`}>
        <p className="sub" style={{ marginTop: 0 }}>
          Prep 5–10 clue stages per avatar before anyone registers. Whichever avatar a squad picks, they automatically inherit that avatar's clue sequence.
        </p>
        <AvatarsTab />
      </div>

      <div className={`tabpane${tab === 't-groups' ? ' active' : ''}`}>
        <GroupsTab />
      </div>

      <div className={`tabpane${tab === 't-bonus' ? ' active' : ''}`}>
        <BonusTab />
      </div>

      <div className={`tabpane${tab === 't-board' ? ' active' : ''}`}>
        <BoardTab />
      </div>

      <button className="btn btn-ghost" style={{ marginTop: 10 }} onClick={goHome}>Log out</button>
    </section>
  );
}
