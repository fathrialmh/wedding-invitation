const DESKTOP_QUERY = '(min-width: 1025px)';

export function isDesktopLayout() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

export function getScrollContainer() {
  return isDesktopLayout() ? document.querySelector('.main') : null;
}

export function scrollToElement(el, options = { behavior: 'smooth' }) {
  if (!el) return;

  const container = getScrollContainer();
  if (container) {
    const top = container.scrollTop + el.getBoundingClientRect().top - container.getBoundingClientRect().top;
    container.scrollTo({ top, ...options });
    return;
  }

  el.scrollIntoView(options);
}

export function getObserverRoot() {
  return getScrollContainer() ?? null;
}
