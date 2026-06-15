import { showToast } from './gift.js';
import { isGoogleScriptConfigured, submitRsvpToGoogleScript } from './google-script.js';
import { addWish, initWishes } from './wishes.js';

function setSubmitting(form, isSubmitting) {
  const button = form.querySelector('[type="submit"]');
  if (!button) return;

  button.disabled = isSubmitting;
  button.dataset.originalLabel ||= button.textContent;
  button.textContent = isSubmitting ? 'Mengirim...' : button.dataset.originalLabel;
}

export function initForms() {
  initWishes();

  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = rsvpForm.querySelector('[name="nama"]')?.value?.trim();
      const guestCount = rsvpForm.querySelector('[name="orang"]')?.value;
      const attendance = rsvpForm.querySelector('[name="attendance"]:checked')?.value;

      if (!name || guestCount === undefined || guestCount === '' || !attendance) {
        showToast('Mohon lengkapi semua field RSVP', 'error');
        return;
      }

      if (!isGoogleScriptConfigured()) {
        showToast('RSVP belum terhubung ke Google Sheet. Atur googleScript.url di config.', 'error');
        return;
      }

      setSubmitting(rsvpForm, true);

      try {
        await submitRsvpToGoogleScript({
          name,
          guestCount: Number(guestCount),
          attendance,
        });
        showToast('✓ Terima kasih! Konfirmasi kehadiran Anda telah tercatat.');
        rsvpForm.reset();
      } catch {
        showToast('Gagal mengirim RSVP. Coba lagi.', 'error');
      } finally {
        setSubmitting(rsvpForm, false);
      }
    });
  }

  const wishesForm = document.getElementById('wishes-form');
  if (wishesForm) {
    wishesForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = wishesForm.querySelector('[name="wishes-name"]')?.value?.trim();
      const msg = wishesForm.querySelector('[name="wishes-message"]')?.value?.trim();

      if (!name || !msg) {
        showToast('Mohon isi nama dan ucapan', 'error');
        return;
      }

      setSubmitting(wishesForm, true);

      try {
        await addWish(name, msg);
        showToast('✓ Ucapan & doa Anda berhasil dikirim. Terima kasih!');
        wishesForm.reset();
      } catch {
        showToast('Gagal mengirim ucapan. Coba lagi.', 'error');
      } finally {
        setSubmitting(wishesForm, false);
      }
    });
  }
}
