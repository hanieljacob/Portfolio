import { useEffect, useState } from 'react';

// True only while the referenced element is on screen AND the tab is visible.
// Consumers pass this to the Canvas `frameloop` so the GPU idles when the scene
// is scrolled away or the tab is backgrounded (mirrors the rAF-in-background
// concern noted in Hero.jsx).
export function useActiveInView(ref, { threshold = 0 } = {}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let inView = false;
    let visible = !document.hidden;
    const sync = () => setActive(inView && visible);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        sync();
      },
      { threshold }
    );
    io.observe(el);

    const onVisibility = () => {
      visible = !document.hidden;
      sync();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ref, threshold]);

  return active;
}
