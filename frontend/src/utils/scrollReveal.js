export function initScrollReveal() {
  document.documentElement.setAttribute('data-reveal-init', 'true');
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  // Immediately show all to avoid any initial blank content
  elements.forEach((el) => el.classList.add('show'));

  const supportsIO = 'IntersectionObserver' in window;
  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsIO || prefersReduce) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add('show');
    }
  }, { threshold: 0.1 });

  elements.forEach((el) => observer.observe(el));
}