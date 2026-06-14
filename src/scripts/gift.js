import { invitation } from '../config/invitation.js';

export function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.innerHTML = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function copyText(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  return Promise.resolve();
}

export function initGift() {
  const toggleBtn = document.getElementById('gift-toggle');
  const content = document.getElementById('gift-cards');
  const label = document.getElementById('gift-toggle-label');

  if (toggleBtn && content) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      content.classList.toggle('is-open');
      if (label) {
        label.textContent = content.classList.contains('is-open')
          ? invitation.gift.buttonClose
          : invitation.gift.buttonOpen;
      }
    });
  }

  document.getElementById('gift-banks')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    e.preventDefault();
    const text = btn.dataset.copy;
    copyText(text)
      .then(() => showToast(`✓ Successfully copied<br><small>${text}</small>`))
      .catch(() => showToast('Copy failed', 'error'));
  });
}
