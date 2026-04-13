import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const links = [
  {
    label: 'Email',
    value: 'haniel.thomson@gmail.com',
    href: 'mailto:haniel.thomson@gmail.com',
    index: '01',
  },
  {
    label: 'Resume',
    value: 'Download PDF',
    href: '/HanielThomson_Resume.pdf',
    index: '02',
  },
  {
    label: 'GitHub',
    value: 'github.com/hanieljacob',
    href: 'https://github.com/hanieljacob',
    index: '03',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/haniel-jacob',
    href: 'https://www.linkedin.com/in/haniel-jacob/',
    index: '04',
  },
];

export default function Contact() {
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
      id="contact"
      ref={ref}
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--c-bg)',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Section header */}
        <div data-reveal className="section-enter" style={{ marginBottom: '3.5rem' }}>
          <span className="label">04 — Contact</span>
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
              Let's Connect
            </h2>
            <div style={{ flex: 1, height: '1px', background: 'var(--c-border)', maxWidth: '120px' }} />
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '3rem',
            alignItems: 'start',
          }}
          className="lg:grid-cols-[400px_1fr]"
        >
          {/* Copy */}
          <div data-reveal className="section-enter">
            <p
              style={{
                fontFamily: 'Source Serif 4, serif',
                fontSize: '1.1rem',
                color: 'var(--c-text-dim)',
                lineHeight: 1.8,
                margin: '0 0 1.5rem',
              }}
            >
              Have a project in mind or just want to say hi? I'd love to hear
              from you. Drop me a message and I'll get back to you soon.
            </p>
            <p
              style={{
                fontFamily: 'Source Serif 4, serif',
                fontStyle: 'italic',
                fontSize: '0.95rem',
                color: 'var(--c-text-ghost)',
                margin: 0,
              }}
            >
              Currently open to full-time roles and interesting collaborations.
            </p>
          </div>

          {/* Links grid */}
          <div
            data-reveal
            className="section-enter sm:grid-cols-2"
            style={{
              display: 'grid',
              gap: '1px',
              gridTemplateColumns: '1fr',
              background: 'var(--c-border)',
              border: '1px solid var(--c-border)',
            }}
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') || link.href.startsWith('mailto') || link.href.endsWith('.pdf') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="contact-link"
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                  }}
                >
                  <span className="label" style={{ color: 'var(--c-text-ghost)' }}>
                    {link.label}
                  </span>
                  <ArrowUpRight
                    style={{
                      width: '13px',
                      height: '13px',
                      color: 'var(--c-text-ghost)',
                      flexShrink: 0,
                    }}
                  />
                </div>
                <span
                  className="contact-link-value"
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--c-text)',
                    transition: 'color 0.2s',
                    wordBreak: 'break-all',
                  }}
                >
                  {link.value}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
