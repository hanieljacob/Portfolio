import { useEffect, useRef } from 'react';

const stats = [
  { value: '2+',   label: 'Years of Experience',         sub: 'industry' },
  { value: '175+', label: 'Fulfillment Centers',          sub: 'supported' },
];

export default function About() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
              el.style.transitionDelay = `${i * 0.08}s`;
              el.classList.add('visible');
            });
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
          <span className="label">01 — About</span>
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
            gridTemplateColumns: '1fr',
            gap: '3.5rem',
            alignItems: 'start',
          }}
          className="md:grid-cols-[1fr_300px]"
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
              <span style={{ fontStyle: 'italic' }}>Boston University</span>,
              specializing in data-centric computing. At Amazon Robotics I built
              real-time computer vision systems that operate at scale across{' '}
              hundreds of fulfillment centers worldwide.
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
              I enjoy solving complex problems — from automating CI/CD pipelines
              that cut release time by 90%, to building LLM-powered agents and
              research tools in Unity and C#. I'm based in{' '}
              <span style={{ color: 'var(--c-text)' }}>San Francisco</span> and
              open to opportunities worldwide.
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
              {['Computer Vision', 'Machine Learning', 'Full-Stack', 'Real-Time Systems'].map(tag => (
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
          <div
            data-reveal
            className="section-enter"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
              border: '1px solid var(--c-border)',
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
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
                  }}
                >
                  {stat.value}
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
    </section>
  );
}
