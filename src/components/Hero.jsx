import { lazy, Suspense, useEffect, useRef } from 'react';
import { use3DEnabled } from './three/use3DEnabled';
import { useActiveInView } from './three/useActiveInView';

const Scene = lazy(() => import('./three/Scene'));

const heroImage = new URL('/hero-photo.png', import.meta.url).href;

const NAME_TOP = 'HANIEL';
const NAME_BOTTOM = 'THOMSON';

function useMagnetic(strength = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const onMove = e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => { el.style.transform = 'translate(0, 0)'; };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return ref;
}

export default function Hero({ ready = true }) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const projectsBtnRef = useMagnetic();
  const contactBtnRef = useMagnetic();
  const threeEnabled = use3DEnabled();
  const threeActive = useActiveInView(sectionRef);

  // Staggered entrance, held until the preloader hands off.
  // Applied synchronously rather than inside rAF: rAF is paused in background
  // tabs, which would leave the hero stuck at opacity 0 until the tab is focused.
  useEffect(() => {
    if (!ready) return;
    const el = containerRef.current;
    if (!el) return;

    el.querySelectorAll('[data-animate]').forEach((node, i) => {
      node.style.animationDelay = `${i * 0.1 + 0.15}s`;
      node.classList.add('animate-fade-up');
    });
    el.querySelectorAll('.hero-letter').forEach((node, i) => {
      node.style.animationDelay = `${i * 0.035 + 0.25}s`;
      node.classList.add('hero-letter-in');
    });
  }, [ready]);

  // Pointer parallax drives --px / --py, consumed by the glow and photo
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = null;
    let px = 0;
    let py = 0;

    const apply = () => {
      frame = null;
      el.style.setProperty('--px', px.toFixed(3));
      el.style.setProperty('--py', py.toFixed(3));
    };

    const onMove = e => {
      const rect = el.getBoundingClientRect();
      px = (e.clientX - rect.left) / rect.width - 0.5;
      py = (e.clientY - rect.top) / rect.height - 0.5;
      if (frame === null) frame = requestAnimationFrame(apply);
    };

    el.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mousemove', onMove);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero"
      style={{
        minHeight: '100dvh',
        background: 'var(--c-bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle dot-grid background */}
      <div
        aria-hidden="true"
        className="hero-grid"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, var(--c-text-ghost) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.18,
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Drifting amber glows */}
      <div aria-hidden="true" className="hero-glow hero-glow-a" />
      <div aria-hidden="true" className="hero-glow hero-glow-b" />

      {/* Interactive neural-node constellation (3D). Mounts only after the
          preloader hands off (`ready`) and when the device is capable —
          otherwise the dot-grid + glows above are the graceful fallback. */}
      {ready && threeEnabled && (
        <Suspense fallback={null}>
          <div
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
          >
            <Scene active={threeActive} count={120} connectionDist={2.6} opacity={0.9} />
          </div>
        </Suspense>
      )}

      <div
        ref={containerRef}
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 1.5rem',
          paddingTop: '80px',
          paddingBottom: '5rem',
          width: '100%',
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gap: '3rem',
          alignItems: 'center',
        }}
        className="grid-hero"
      >
        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Label */}
          <div data-animate style={{ opacity: 0, marginBottom: '1.75rem' }}>
            <span className="label hero-label">
              <span className="hero-label-pulse" aria-hidden="true" />
              Software Engineer · AI Agents &amp; LLM Systems
            </span>
          </div>

          {/* Name */}
          <h1
            className="hero-name"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(2.6rem, 5.6vw, 5rem)',
              lineHeight: 0.92,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            <span className="hero-name-line">
              {NAME_TOP.split('').map((char, i) => (
                <span className="hero-letter" key={`t-${i}`}>
                  {char}
                </span>
              ))}
            </span>
            <span className="hero-name-line hero-name-outline">
              {NAME_BOTTOM.split('').map((char, i) => (
                <span className="hero-letter" key={`b-${i}`}>
                  {char}
                </span>
              ))}
            </span>
          </h1>

          {/* Amber hairline */}
          <div
            data-animate
            style={{
              opacity: 0,
              height: '1px',
              background:
                'linear-gradient(to right, var(--c-amber), transparent)',
              margin: '2rem 0',
              maxWidth: '220px',
            }}
          />

          {/* Bio */}
          <p
            data-animate
            style={{
              opacity: 0,
              fontFamily: 'Source Serif 4, serif',
              fontSize: '1.05rem',
              color: 'var(--c-text-dim)',
              lineHeight: 1.75,
              maxWidth: '480px',
              margin: '0 0 2.5rem',
            }}
          >
            Building AI agents and LLM-powered systems, backed by a foundation in
            real-time machine learning and full-stack engineering. Previously at{' '}
            <span style={{ color: 'var(--c-text)', fontStyle: 'italic' }}>
              Amazon Robotics
            </span>
            .
          </p>

          {/* CTAs */}
          <div
            data-animate
            style={{
              opacity: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <a ref={projectsBtnRef} href="#projects" className="btn btn-primary">
              <span>View Projects</span>
            </a>
            <a ref={contactBtnRef} href="#contact" className="btn btn-ghost">
              <span>Get in Touch</span>
            </a>
          </div>
        </div>

        {/* Photo */}
        <div
          data-animate
          className="order-first lg:order-last hero-photo-wrap"
          style={{
            opacity: 0,
            position: 'relative',
            justifySelf: 'center',
            width: '100%',
            maxWidth: '380px',
          }}
        >
          {/* Corner accents */}
          <div
            aria-hidden="true"
            className="hero-corner hero-corner-tr"
            style={{
              position: 'absolute',
              top: '-14px',
              right: '-14px',
              width: '56px',
              height: '56px',
              borderTop: '1.5px solid var(--c-amber)',
              borderRight: '1.5px solid var(--c-amber)',
              opacity: 0.7,
            }}
          />
          <div
            aria-hidden="true"
            className="hero-corner hero-corner-bl"
            style={{
              position: 'absolute',
              bottom: '-14px',
              left: '-14px',
              width: '56px',
              height: '56px',
              borderBottom: '1.5px solid var(--c-amber)',
              borderLeft: '1.5px solid var(--c-amber)',
              opacity: 0.7,
            }}
          />

          {/* Index label */}
          <div style={{ position: 'absolute', top: '-28px', left: 0 }}>
            <span
              className="label"
              style={{ color: 'var(--c-text-ghost)', fontSize: '0.6rem' }}
            >
              fig. 01
            </span>
          </div>

          <div className="hero-photo-frame">
            <img
              src={heroImage}
              alt="Haniel Thomson"
              className="hero-photo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 35%',
                display: 'block',
              }}
            />
            <div className="hero-photo-sheen" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          className="label"
          style={{ color: 'var(--c-text-ghost)', fontSize: '0.58rem' }}
        >
          scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '32px',
            background: 'var(--c-amber)',
            opacity: 0.5,
            animation: 'scrollLine 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  );
}
