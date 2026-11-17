import { useEffect, useRef, useState } from 'react';

export default function CountUp({ to, suffix = '', decimals = 0 }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        setValue(to);
        return;
      }

      const duration = 1500;
      let start = null;
      let frame;

      const tick = (now) => {
        if (start === null) start = now;
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        const factor = 10 ** decimals;
        setValue(Math.round(to * eased * factor) / factor);
        if (t < 1) frame = requestAnimationFrame(tick);
      };

      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    };

    let cleanup;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        cleanup = run();
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, [to, decimals]);

  return (
    <span ref={ref}>
      {value.toFixed(decimals)}{suffix}
    </span>
  );
}
