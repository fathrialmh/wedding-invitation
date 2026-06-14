const animationMap = {
  fadeInUp: 'elementor-animation-fadeInUp',
  fadeInDown: 'elementor-animation-fadeInDown',
  fadeIn: 'elementor-animation-fadeIn',
  zoomIn: 'elementor-animation-zoomIn',
  slideInUp: 'elementor-animation-slideInUp',
  flash: 'elementor-animation-flash',
};

const observed = new WeakSet();

export function initAnimations() {
  const elements = document.querySelectorAll('.elementor-invisible[data-animation]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const anim = el.dataset.animation;
        const animClass = animationMap[anim];
        if (!animClass) return;

        const duration = el.classList.contains('animated-slow') ? '1.5s' : '1s';
        el.style.animationDuration = duration;
        const delay = el.dataset.animationDelay;
        if (delay) el.style.animationDelay = `${delay}ms`;
        el.classList.add('elementor-animated', animClass);
        observer.unobserve(el);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => {
    if (observed.has(el)) return;
    observed.add(el);
    observer.observe(el);
  });
}
