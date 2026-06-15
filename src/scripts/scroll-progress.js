import { getScrollContainer } from './scroll-utils.js';

export function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.innerHTML = '<div class="scroll-progress-bar"></div>';
  document.body.appendChild(bar);

  const fill = bar.querySelector('.scroll-progress-bar');
  const container = getScrollContainer();

  function updateProgress() {
    const scrollTop = container ? container.scrollTop : window.scrollY;
    const scrollHeight = container ? container.scrollHeight : document.body.scrollHeight;
    const clientHeight = container ? container.clientHeight : window.innerHeight;
    const maxScroll = scrollHeight - clientHeight;
    const scrollPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    fill.style.width = `${Math.min(scrollPercent, 100)}%`;
  }

  (container ?? window).addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}
