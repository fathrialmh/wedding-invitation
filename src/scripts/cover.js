import { invitation } from '../config/invitation.js';

let scrollLocked = true;
let x = 0;
let y = 0;

function disableScrolling() {
  x = window.scrollX;
  y = window.scrollY;
  window.onscroll = () => window.scrollTo(x, y);
}

function enableScrolling() {
  window.onscroll = null;
}

export function initCover(onOpen) {
  window.onbeforeunload = () => window.scrollTo(0, 0);

  document.body.style.overflowY = 'hidden';
  document.body.style.height = '100dvh';
  disableScrolling();

  const btn = document.getElementById('btn-cover');
  const btnWrap = document.getElementById('cover-btn-wrap');

  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    scrollLocked = false;
    document.body.style.overflowY = 'unset';
    document.body.style.height = 'auto';
    enableScrolling();

    document.getElementById('ayatsuci')?.scrollIntoView({ behavior: 'smooth' });
    if (btnWrap) btnWrap.classList.add('hidden');

    if (onOpen) onOpen();
  });

  if (window.location.hash === '#ayatsuci') {
    scrollLocked = false;
    document.body.style.overflowY = 'unset';
    document.body.style.height = 'auto';
    enableScrolling();
    if (btnWrap) btnWrap.classList.add('hidden');
  }
}

export function isScrollLocked() {
  return scrollLocked;
}

export { invitation };
