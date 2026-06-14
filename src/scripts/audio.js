import { invitation } from '../config/invitation.js';

let audio = null;
let playing = false;

export function initAudio() {
  audio = document.getElementById('weddingAudio');
  const btn = document.getElementById('audioButton');
  if (!audio || !btn) return;

  audio.src = invitation.audio.src;
  audio.loop = true;

  btn.addEventListener('click', toggleAudio);

  document.addEventListener('visibilitychange', () => {
    if (!audio) return;
    if (document.visibilityState === 'visible' && playing) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });
}

export function toggleAudio() {
  const btn = document.getElementById('audioButton');
  if (!audio || !btn) return;

  if (playing) {
    audio.pause();
    btn.innerHTML = '<i class="fas fa-play"></i>';
    playing = false;
  } else {
    audio.play().catch(() => {});
    btn.innerHTML = '<i class="fas fa-pause"></i>';
    playing = true;
  }
}

export function playAudio() {
  if (!audio) return;
  audio.play().catch(() => {});
  playing = true;
  const btn = document.getElementById('audioButton');
  if (btn) btn.innerHTML = '<i class="fas fa-pause"></i>';
}
