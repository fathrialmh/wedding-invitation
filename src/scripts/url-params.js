export function initUrlParams() {
  const params = new URLSearchParams(window.location.search);
  params.forEach((val, key) => {
    const decoded = decodeURIComponent((val || '').replace(/\+/g, ' '));
    document.querySelectorAll(`[data-fill-param="${key}"]`).forEach((el) => {
      el.textContent = decoded;
    });
    document.querySelectorAll(`input[name="${key}"]`).forEach((inp) => {
      inp.value = decoded;
    });
  });
}
