export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--c-border)',
        background: 'var(--c-bg)',
        padding: '2rem 0',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              display: 'inline-block',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: 'var(--c-amber)',
              opacity: 0.6,
            }}
          />
          <span
            className="label"
            style={{ color: 'var(--c-text-ghost)', fontSize: '0.62rem' }}
          >
            © {year} Haniel Thomson
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span
            className="label"
            style={{ color: 'var(--c-text-ghost)', fontSize: '0.6rem' }}
          >
            Built with React + Vite
          </span>
          <a
            href="#"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              fontSize: '0.65rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--c-text-dim)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-amber)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text-dim)')}
          >
            ↑ Top
          </a>
        </div>
      </div>
    </footer>
  );
}
