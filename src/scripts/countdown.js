import { invitation } from '../config/invitation.js';

export function initCountdown() {
  const wrap = document.getElementById('countdown');
  if (!wrap) return;

  const target = new Date(invitation.countdown.date).getTime();
  const labels = invitation.countdown.labels;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const values = [days, hours, minutes, seconds];
    wrap.innerHTML = values
      .map(
        (v, i) => `
      <div class="countdown-item">
        <span class="countdown-digits">${pad(v)}</span>
        <span class="countdown-label">${labels[i]}</span>
      </div>`
      )
      .join('');
  }

  tick();
  setInterval(tick, 1000);
}
