import React, { useState } from 'react';
import { AVATAR_IMAGES } from '../../data/avatars.js';
import { useGame } from '../../context/GameContext.jsx';
import BonusSection from './BonusSection.jsx';

export default function Clue() {
  const { myGroup, avatarClues, gameState, submitScan, goTo, lang, setLang } = useGame();
  const [qr, setQr] = useState('');
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  // While true, we keep showing the clue text/scan card the player just
  // solved (with the success flash) instead of instantly jumping to the next
  // stage, matching the brief "Correct!" pause from the original demo.
  const [frozenText, setFrozenText] = useState(null);

  const stages = myGroup ? (avatarClues[myGroup.avatar] || []) : [];

  if (!myGroup) {
    // GameContext already redirects to /register when a squad disappears;
    // render nothing for the one tick in between.
    return null;
  }

  const stage = stages[myGroup.stageIndex];
  const ended = gameState.ended;
  const finished = stages.length > 0 && myGroup.stageIndex >= stages.length;
  const pickClue = (s) => (lang === 'hi' && s?.clueHi ? s.clueHi : s?.clue);
  const missingHi = lang === 'hi' && stage && !stage.clueHi;

  async function handleSubmit() {
    const textBeforeSubmit = stage ? pickClue(stage) : null;
    const result = await submitScan(qr);
    if (result.ok === null) return; // empty input, no-op like the original
    if (result.ok) {
      setFrozenText(textBeforeSubmit);
      setFlash(true);
      setMsg({ ok: true, text: result.message });
      setTimeout(() => {
        setFrozenText(null);
        setFlash(false);
        setQr('');
        setMsg(null);
      }, 700);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setMsg({ ok: false, text: result.message });
    }
  }

  let clueText;
  let showScanCard = true;
  if (frozenText !== null) {
    clueText = frozenText;
  } else if (ended) {
    clueText = '🏁 The hunt has ended! Check the leaderboard for final results.';
    showScanCard = false;
  } else if (!stage) {
    clueText = finished
      ? '🏆 You cracked every clue! Sit back and watch the leaderboard.'
      : 'The game master is still preparing your next clue… hang tight! 🕵️';
    showScanCard = false;
  } else {
    clueText = pickClue(stage);
  }

  return (
    <section id="screen-clue" className="screen active">
      <h1>
        <img className="av-img-lg" src={AVATAR_IMAGES[myGroup.avatar] || ''} alt="" /> {myGroup.name}
      </h1>
      <div className="score-pill">⭐ {myGroup.score} pts</div>
      <div className="btn-row" style={{ marginTop: 8 }}>
        <button className={`btn btn-sm ${lang === 'en' ? 'btn-lime' : 'btn-ghost'}`} onClick={() => setLang('en')}>EN</button>
        <button className={`btn btn-sm ${lang === 'hi' ? 'btn-lime' : 'btn-ghost'}`} onClick={() => setLang('hi')}>हिंदी</button>
      </div>
      <div className="dots" style={{ marginTop: 14 }}>
        {stages.map((_, i) => {
          const cls = (myGroup.passed || []).includes(i)
            ? 'passed'
            : i < myGroup.stageIndex ? 'done' : i === myGroup.stageIndex ? 'now' : '';
          return <div key={i} className={`dot ${cls}`} />;
        })}
      </div>
      
      <div className={`clue-card${shake ? ' shake' : ''}${flash ? ' flash-ok' : ''}`}>
        <div className="clue-text">{clueText}</div>
      </div>
      {missingHi && (
        <div className="msg" style={{ opacity: .7, fontSize: '.78rem' }}>
          (हिंदी अनुवाद अभी जोड़ा नहीं गया — showing English)
        </div>
      )}
      {showScanCard && !ended && (
        <div className="card stack">
          <label>Scan result / QR code</label>
          <input
            type="text"
            placeholder="Enter the code from the QR"
            value={qr}
            onChange={(e) => setQr(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button className="btn btn-cyan" onClick={handleSubmit}>📷 Submit Scan</button>
          {msg && <div className={`msg ${msg.ok ? 'ok' : 'err'}`}>{msg.text}</div>}
        </div>
      )}
      {!ended && <BonusSection />}
      <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={() => goTo('leaderboard')}>🏆 Peek at Leaderboard</button>
    </section>
  );
}
