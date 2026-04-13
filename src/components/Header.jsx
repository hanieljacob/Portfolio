import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { href: '#about',    label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#skills',   label: 'Skills' },
  { href: '#contact',  label: 'Contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: '60px',
        borderBottom: `1px solid ${scrolled ? 'var(--c-border)' : 'transparent'}`,
        backgroundColor: scrolled
          ? 'color-mix(in srgb, var(--c-bg) 88%, transparent)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      }}>
        <div style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Monogram */}
          <a
            href="#"
            aria-label="Home"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.06em',
              color: 'var(--c-text)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--c-amber)',
            }} />
            H·T
          </a>

          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
            <div style={{ marginLeft: '0.5rem' }}>
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                color: 'var(--c-text)',
              }}
            >
              <span style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: 'currentColor',
                transition: 'transform 0.3s, opacity 0.3s',
                transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
              }} />
              <span style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: 'currentColor',
                opacity: menuOpen ? 0 : 1,
                transition: 'opacity 0.3s',
              }} />
              <span style={{
                display: 'block',
                width: '22px',
                height: '1.5px',
                background: 'currentColor',
                transition: 'transform 0.3s, opacity 0.3s',
                transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
              }} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'var(--c-bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}
        className="md:hidden"
      >
        {navLinks.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
              color: 'var(--c-text)',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              padding: '0.5rem 2rem',
              transition: 'color 0.2s',
              animationDelay: `${i * 0.07}s`,
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--c-amber)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--c-text)'}
          >
            {link.label}
          </a>
        ))}

        <div style={{
          marginTop: '2rem',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--c-text-ghost)',
        }}>
          haniel.thomson@gmail.com
        </div>
      </div>
    </>
  );
}
