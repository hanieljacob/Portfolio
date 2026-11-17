import { useEffect } from 'react';

/**
 * Reveals every [data-reveal] element inside `ref` once the section scrolls
 * into view. `key` lets data-driven sections (projects) re-run after load.
 */
export function useReveal(ref, key = '') {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = root.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        targets.forEach((el, i) => {
          el.style.transitionDelay = `${Math.min(i, 6) * 0.07}s`;
          el.classList.add('is-visible');
        });
        observer.disconnect();
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [ref, key]);
}
