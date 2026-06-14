import { showToast } from './gift.js';
import { addWish, initWishes } from './wishes.js';

export function initForms() {
  initWishes();
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('✓ Terima kasih! Konfirmasi kehadiran Anda telah tercatat.');
      rsvpForm.reset();
    });
  }

  const wishesForm = document.getElementById('wishes-form');
  if (wishesForm) {
    wishesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = wishesForm.querySelector('[name="wishes-name"]')?.value?.trim();
      const msg = wishesForm.querySelector('[name="wishes-message"]')?.value?.trim();
      if (!name || !msg) {
        showToast('Mohon isi nama dan ucapan', 'error');
        return;
      }
      addWish(name, msg);
      showToast('✓ Ucapan & doa Anda berhasil dikirim. Terima kasih!');
      wishesForm.reset();
    });
  }
}
