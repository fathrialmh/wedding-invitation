const sections = ['cover', 'profil', 'event', 'rsvp', 'wishes'];

export function initNavigation() {
  const links = document.querySelectorAll('.bottom-nav a');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href?.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}
