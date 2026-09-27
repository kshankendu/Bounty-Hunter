const COLORS = ['var(--lime)', 'var(--magenta)', 'var(--cyan)', 'var(--gold)'];
const EMOJIS = ['🎉', '🎊', '🥳'];

// Purely decorative, so it's kept as a small imperative DOM effect (like the
// original vanilla version) instead of routing celebration confetti through
// React state.
export function launchConfetti(count) {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:250;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const size = 6 + Math.random() * 8;
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = size + 'px';
    p.style.height = size * 1.6 + 'px';
    p.style.background = COLORS[i % COLORS.length];
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
    p.style.animationDuration = 2.2 + Math.random() * 2 + 's';
    p.style.animationDelay = Math.random() * 0.6 + 's';
    container.appendChild(p);
  }

  const emojiCount = Math.round(count / 8);
  for (let i = 0; i < emojiCount; i++) {
    const e = document.createElement('div');
    e.className = 'confetti-emoji';
    e.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    e.style.left = Math.random() * 100 + 'vw';
    e.style.animationDuration = 2.6 + Math.random() * 1.8 + 's';
    e.style.animationDelay = Math.random() * 0.6 + 's';
    container.appendChild(e);
  }

  setTimeout(() => container.remove(), 5000);
}
