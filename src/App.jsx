import React from 'react';
import { useGame } from './context/GameContext.jsx';
import TopBar from './components/TopBar.jsx';
import Home from './components/screens/Home.jsx';
import AdminLogin from './components/screens/AdminLogin.jsx';
import AdminDashboard from './components/screens/AdminDashboard/index.jsx';
import Register from './components/screens/Register.jsx';
import Clue from './components/screens/Clue.jsx';
import Leaderboard from './components/screens/Leaderboard.jsx';
import BonusModal from './components/modals/BonusModal.jsx';
import ConfirmModal from './components/modals/ConfirmModal.jsx';
import GameEndModal from './components/modals/GameEndModal.jsx';

const SCREENS = {
  home: Home,
  'admin-login': AdminLogin,
  admin: AdminDashboard,
  register: Register,
  clue: Clue,
  leaderboard: Leaderboard
};

export default function App() {
  const { screen } = useGame();
  const ScreenComponent = SCREENS[screen] || Home;

  return (
    <>
      <div className="app">
        <TopBar />
        <ScreenComponent />
        <footer className="note">
          Live game data is synced through an Express + MongoDB API — every device stays in sync.
        </footer>
      </div>

      <BonusModal />
      <ConfirmModal />
      <GameEndModal />
    </>
  );
}
