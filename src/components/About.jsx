import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { use3DEnabled } from './three/use3DEnabled';
import { useActiveInView } from './three/useActiveInView';

const Scene = lazy(() => import('./three/Scene'));

const stats = [
  { value: 3,   suffix: '+', label: 'Years of Experience', sub: 'industry' },
  { value: 175, suffix: '+', label: 'Fulfillment Centers',  sub: 'supported' },
];

const COUNT_DURATION = 1400;

function CountUp({ to, suffix, run }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!run) return;

    // Reduced motion collapses the duration so the value lands on the first frame
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : COUNT_DURATION;

    let frame;
    let start = null;
    const tick = now => {
      if (start === null) start = now;
      const t = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      setN(Math.round(to * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, to]);

  return <>{n}{suffix}</>;
}

export default function About() {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const threeEnabled = use3DEnabled();
  const threeActive = useActiveInView(ref);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
              el.style.transitionDelay = `${i * 0.08}s`;
              el.classList.add('visible');
            });
            setRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={ref}
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--c-surface)',
        borderTop: '1px solid var(--c-border)',
        borderBottom: '1px solid var(--c-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        {/* Section header */}
        <div
          data-reveal
          className="section-enter"
          style={{ marginBottom: '3.5rem' }}
        >
          <span className="label">01 / About</span>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '1rem',
              marginTop: '0.75rem',
            }}
          >
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
                color: 'var(--c-text)',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              Who I Am
            </h2>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: 'var(--c-border)',
                maxWidth: '120px',
              }}
            />
          </div>
        </div>

        {/* Content grid */}
        <div
          style={{
            display: 'grid',
            gap: '3.5rem',
            alignItems: 'start',
          }}
          className="grid-about"
        >
          {/* Prose */}
          <div
            data-reveal
            className="section-enter"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <p
              style={{
                fontFamily: 'Source Serif 4, serif',
                fontSize: '1.1rem',
                color: 'var(--c-text)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              I'm a Software Engineer with a Master's in Computer Science from{' '}
              <span style={{ fontStyle: 'italic' }}>Boston University</span>. My
              focus is building AI agents and LLM-powered systems. At Amazon
              Robotics I shipped real-time machine learning systems that operate
              at scale across hundreds of fulfillment centers worldwide.
            </p>
            <p
              style={{
                fontFamily: 'Source Serif 4, serif',
                fontSize: '1.05rem',
                color: 'var(--c-text-dim)',
                lineHeight: 1.8,
                margin: 0,
              }}
            >
              I enjoy solving complex problems, from designing agentic workflows
              and LLM tooling, to automating CI/CD pipelines that cut release
              time by 90% and building research tools in Unity and C#. I'm open
              to opportunities{' '}
              <span style={{ color: 'var(--c-text)' }}>anywhere in the US</span>.
            </p>

            {/* Spec tags */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '0.5rem',
              }}
            >
              {['AI Agents', 'LLM Systems', 'Machine Learning', 'Full-Stack'].map(tag => (
                <span
                  key={tag}
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    padding: '0.3rem 0.7rem',
                    border: '1px solid var(--c-border-md)',
                    color: 'var(--c-text-dim)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ position: 'relative' }}>
            {/* Subtle node-network accent behind the stats (subordinate to Hero) */}
            {threeEnabled && (
              <Suspense fallback={null}>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: '-18% -22%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    opacity: 0.55,
                  }}
                >
                  <Scene
                    active={threeActive}
                    count={55}
                    connectionDist={2.4}
                    scale={0.7}
                    opacity={0.8}
                    parallax={false}
                    camera={{ position: [0, 0, 12], fov: 55 }}
                  />
                </div>
              </Suspense>
            )}
          <div
            data-reveal
            className="section-enter"
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              border: '1px solid var(--c-border)',
              background: 'var(--c-surface)',
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="stat-cell"
                style={{
                  padding: '1.5rem',
                  borderBottom: i < stats.length - 1 ? '1px solid var(--c-border)' : 'none',
                  position: 'relative',
                }}
              >
                {/* Amber left accent */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '1.5rem',
                    bottom: '1.5rem',
                    width: '2px',
                    background: 'var(--c-amber)',
                    opacity: 0.5,
                  }}
                />
                <div
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 800,
                    fontSize: '2.25rem',
                    color: 'var(--c-amber)',
                    lineHeight: 1,
                    marginBottom: '0.35rem',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <CountUp to={stat.value} suffix={stat.suffix} run={revealed} />
                </div>
                <div
                  style={{
                    fontFamily: 'Source Serif 4, serif',
                    fontSize: '0.85rem',
                    color: 'var(--c-text)',
                    lineHeight: 1.4,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  className="label"
                  style={{
                    color: 'var(--c-text-ghost)',
                    marginTop: '0.2rem',
                    display: 'block',
                  }}
                >
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
