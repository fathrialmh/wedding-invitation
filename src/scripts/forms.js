import { showToast } from './gift.js';
import { isGoogleScriptConfigured, submitRsvpToGoogleScript } from './google-script.js';
import { addWish, initWishes, renderWishesList } from './wishes.js';

function setSubmitting(form, isSubmitting) {
  const button = form.querySelector('[type="submit"]');
  if (!button) return;

  button.disabled = isSubmitting;
  button.dataset.originalLabel ||= button.textContent;
  button.textContent = isSubmitting ? 'Mengirim...' : button.dataset.originalLabel;
}

export function initForms() {
  initWishes().catch(() => renderWishesList([]));

  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = rsvpForm.querySelector('[name="nama"]')?.value?.trim();
      const guestCount = rsvpForm.querySelector('[name="orang"]')?.value;
      const attendance = rsvpForm.querySelector('[name="attendance"]:checked')?.value;
      const message = rsvpForm.querySelector('[name="message"]')?.value?.trim() || '';

      if (!name || guestCount === undefined || guestCount === '' || !attendance) {
        showToast('Mohon lengkapi semua field RSVP', 'error');
        return;
      }

      if (!isGoogleScriptConfigured()) {
        if (message) {
          setSubmitting(rsvpForm, true);
          try {
            await addWish(name, message);
            showToast('✓ Ucapan & doa Anda berhasil dikirim. Terima kasih!');
            rsvpForm.reset();
          } catch {
            showToast('Gagal mengirim ucapan. Coba lagi.', 'error');
          } finally {
            setSubmitting(rsvpForm, false);
          }
          return;
        }

        showToast('RSVP belum terhubung ke Google Sheet. Atur googleScript.url di config.', 'error');
        return;
      }

      setSubmitting(rsvpForm, true);

      try {
        await submitRsvpToGoogleScript({
          name,
          guestCount: Number(guestCount),
          attendance,
          message,
        });

        if (message) {
          await initWishes();
        }

        showToast(
          message
            ? '✓ Terima kasih! Konfirmasi kehadiran dan ucapan Anda telah tercatat.'
            : '✓ Terima kasih! Konfirmasi kehadiran Anda telah tercatat.'
        );
        rsvpForm.reset();
      } catch {
        showToast('Gagal mengirim RSVP. Coba lagi.', 'error');
      } finally {
        setSubmitting(rsvpForm, false);
      }
    });
  }
}
