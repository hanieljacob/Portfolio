import { useEffect, useRef } from 'react';

const skillCategories = [
  {
    index: '01',
    title: 'Languages',
    skills: ['Java', 'Python', 'TypeScript', 'JavaScript', 'Kotlin', 'SQL', 'HTML', 'CSS', 'C#'],
  },
  {
    index: '02',
    title: 'Frameworks',
    skills: ['React', 'Node.js', 'Express', 'Spring Boot', 'Django', 'Unity'],
  },
  {
    index: '03',
    title: 'Tools & Infra',
    skills: ['AWS', 'PostgreSQL', 'MongoDB', 'Git', 'Docker', 'Auth0', 'Jenkins'],
  },
];

export default function Skills() {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.09}s`;
            el.classList.add('visible');
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--c-surface)',
        borderBottom: '1px solid var(--c-border)',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Section header */}
        <div data-reveal className="section-enter" style={{ marginBottom: '3.5rem' }}>
          <span className="label">03 — Capabilities</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '0.75rem' }}>
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
              Skills & Tools
            </h2>
            <div style={{ flex: 1, height: '1px', background: 'var(--c-border)', maxWidth: '120px' }} />
          </div>
        </div>

        {/* Categories */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0',
            border: '1px solid var(--c-border)',
          }}
          className="md:grid-cols-3"
        >
          {skillCategories.map((cat, ci) => (
            <div
              key={cat.title}
              data-reveal
              className="section-enter"
              style={{
                borderRight: ci < skillCategories.length - 1 ? '1px solid var(--c-border)' : 'none',
                borderBottom: '0',
                padding: '0',
              }}
              // On mobile, add a bottom border between categories
            >
              {/* Category header */}
              <div
                style={{
                  padding: '1.25rem 1.75rem',
                  borderBottom: '1px solid var(--c-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--c-amber)',
                    flexShrink: 0,
                  }}
                />
                <span
                  className="label"
                  style={{ color: 'var(--c-text)', fontSize: '0.68rem' }}
                >
                  {cat.title}
                </span>
                <span
                  className="label"
                  style={{ color: 'var(--c-text-ghost)', marginLeft: 'auto', fontSize: '0.58rem' }}
                >
                  {cat.index}
                </span>
              </div>

              {/* Skills list */}
              <div style={{ padding: '0.5rem 0' }}>
                {cat.skills.map((skill) => (
                  <div
                    key={skill}
                    className="skill-tag"
                    style={{
                      padding: '0.6rem 1.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{skill}</span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '4px',
                        height: '4px',
                        borderRadius: '50%',
                        background: 'var(--c-text-ghost)',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Education callout */}
        <div
          data-reveal
          className="section-enter"
          style={{
            marginTop: '2rem',
            padding: '1.25rem 1.75rem',
            border: '1px solid var(--c-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                width: '2px',
                height: '2rem',
                background: 'var(--c-amber)',
                opacity: 0.6,
                display: 'block',
                flexShrink: 0,
              }}
            />
            <div>
              <span
                className="label"
                style={{ color: 'var(--c-text-ghost)', display: 'block', marginBottom: '0.2rem' }}
              >
                Education
              </span>
              <span
                style={{
                  fontFamily: 'Source Serif 4, serif',
                  fontSize: '0.95rem',
                  color: 'var(--c-text)',
                }}
              >
                M.S. Computer Science,{' '}
                <span style={{ fontStyle: 'italic' }}>Boston University</span>
              </span>
            </div>
          </div>
          <span
            className="label"
            style={{ color: 'var(--c-text-dim)', fontSize: '0.62rem' }}
          >
            Data-Centric Computing
          </span>
        </div>
      </div>
    </section>
  );
}
