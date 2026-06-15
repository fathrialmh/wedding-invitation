import { invitation } from '../config/invitation.js';
import { isDesktopLayout, scrollToElement } from './scroll-utils.js';

let scrollLocked = true;
let windowScrollX = 0;
let windowScrollY = 0;

function disableWindowScrolling() {
  windowScrollX = window.scrollX;
  windowScrollY = window.scrollY;
  window.onscroll = () => window.scrollTo(windowScrollX, windowScrollY);
}

function enableWindowScrolling() {
  window.onscroll = null;
}

function lockScroll() {
  scrollLocked = true;

  if (isDesktopLayout()) {
    const main = document.querySelector('.main');
    if (main) {
      main.classList.add('is-scroll-locked');
      main.scrollTop = 0;
    }
    return;
  }

  document.body.style.overflowY = 'hidden';
  document.body.style.height = '100dvh';
  disableWindowScrolling();
}

function unlockScroll() {
  scrollLocked = false;

  if (isDesktopLayout()) {
    document.querySelector('.main')?.classList.remove('is-scroll-locked');
    return;
  }

  document.body.style.overflowY = 'unset';
  document.body.style.height = 'auto';
  enableWindowScrolling();
}

function openInvitation(onOpen) {
  unlockScroll();

  const btnWrap = document.getElementById('cover-btn-wrap');
  scrollToElement(document.getElementById('ayatsuci'), { behavior: 'smooth' });
  if (btnWrap) btnWrap.classList.add('hidden');

  if (onOpen) onOpen();
}

export function initCover(onOpen) {
  window.onbeforeunload = () => window.scrollTo(0, 0);
  lockScroll();

  const btn = document.getElementById('btn-cover');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openInvitation(onOpen);
  });

  if (window.location.hash === '#ayatsuci') {
    unlockScroll();
    document.getElementById('cover-btn-wrap')?.classList.add('hidden');
  }
}

export function isScrollLocked() {
  return scrollLocked;
}

export { invitation };
