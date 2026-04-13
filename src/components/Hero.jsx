import { useEffect, useRef } from 'react';

const heroImage = new URL('/hero-photo.png', import.meta.url).href;

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Trigger staggered entrance
    requestAnimationFrame(() => {
      el.querySelectorAll('[data-animate]').forEach((node, i) => {
        node.style.animationDelay = `${i * 0.1 + 0.1}s`;
        node.classList.add('animate-fade-up');
      });
    });
  }, []);

  return (
    <section
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

      {/* Amber glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '50vw',
          height: '50vw',
          background:
            'radial-gradient(circle, var(--c-amber-10) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

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
          gridTemplateColumns: '1fr',
          gap: '3rem',
          alignItems: 'center',
        }}
        className="lg:grid-cols-[1fr_420px]"
      >
        {/* ── Text ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {/* Label */}
          <div
            data-animate
            style={{ opacity: 0, marginBottom: '1.75rem' }}
          >
            <span className="label">Software Engineer · San Francisco</span>
          </div>

          {/* Name */}
          <h1
            data-animate
            style={{
              opacity: 0,
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(3.2rem, 7.5vw, 6.5rem)',
              lineHeight: 0.92,
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            <span
              style={{
                display: 'block',
                color: 'var(--c-text)',
              }}
            >
              HANIEL
            </span>
            <span
              style={{
                display: 'block',
                color: 'transparent',
                WebkitTextStroke: '2px var(--c-amber)',
                textStroke: '2px var(--c-amber)',
              }}
            >
              THOMSON
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
            Building real-time systems at the intersection of computer vision,
            machine learning, and full-stack engineering. Previously at{' '}
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
            <a
              href="#projects"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '0.75rem 1.85rem',
                background: 'var(--c-amber)',
                color: 'var(--c-bg)',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              View Projects
            </a>
            <a
              href="#contact"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '0.72rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '0.75rem 1.85rem',
                background: 'transparent',
                color: 'var(--c-text)',
                textDecoration: 'none',
                border: '1px solid var(--c-border-md)',
                transition: 'border-color 0.2s, color 0.2s',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--c-amber-20)';
                e.currentTarget.style.color = 'var(--c-amber)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--c-border-md)';
                e.currentTarget.style.color = 'var(--c-text)';
              }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* ── Photo ────────────────────────────────────── */}
        <div
          data-animate
          style={{
            opacity: 0,
            position: 'relative',
            justifySelf: 'center',
            width: '100%',
            maxWidth: '380px',
          }}
          className="order-first lg:order-last"
        >
          {/* Corner accents */}
          <div
            aria-hidden="true"
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
          <div
            style={{
              position: 'absolute',
              top: '-28px',
              left: 0,
            }}
          >
            <span
              className="label"
              style={{ color: 'var(--c-text-ghost)', fontSize: '0.6rem' }}
            >
              fig. 01
            </span>
          </div>

          <div
            style={{
              aspectRatio: '4/5',
              overflow: 'hidden',
              border: '1px solid var(--c-border)',
            }}
          >
            <img
              src={heroImage}
              alt="Haniel Thomson"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 35%',
                filter: 'grayscale(15%) contrast(1.05)',
                display: 'block',
              }}
            />
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
