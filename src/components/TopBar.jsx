import React from 'react';
import logo from '../assets/logo.png';
import { useGame } from '../context/GameContext.jsx';

export default function TopBar() {
  const { goHome } = useGame();
  return (
    <div className="topbar">
      <div className="brand">
        <img className="header-logo" src={logo} alt="Bounty Hunter" />
      </div>
      <button className="navbtn" onClick={goHome}>🏠 Home</button>
    </div>
  );
}
