import React from 'react';
import { useGame } from '../../context/GameContext.jsx';
import LeaderboardList from '../common/LeaderboardList.jsx';

export default function Leaderboard() {
  const { gameState } = useGame();
  const revealed = gameState.ended;
  return (
    <section id="screen-leaderboard" className="screen active">
      <h1>Leaderboard 🏆</h1>
      <p className="sub">
        {revealed
          ? "The hunt is over — here's who was who! 🎭"
          : 'Ranks & points update live. Everyone else stays a Mystery Hunter 🕵️ — only your own squad is revealed.'}
      </p>
      <LeaderboardList maskNames={!revealed} />
    </section>
  );
}
