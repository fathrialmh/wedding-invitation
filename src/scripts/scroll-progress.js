export function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.innerHTML = '<div class="scroll-progress-bar"></div>';
  document.body.appendChild(bar);

  const fill = bar.querySelector('.scroll-progress-bar');

  window.addEventListener('scroll', () => {
    const scrollPercent =
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    fill.style.width = `${Math.min(scrollPercent, 100)}%`;
  });
}
