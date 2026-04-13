import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

const GITHUB_USERNAME = 'hanieljacob';
const MAX_PROJECTS = 6;
const FEATURED_REPOS = new Set([
  'Daily-Digest',
  'Windborne-dashboard',
  'Industrial-Dashboard',
]);
const EXCLUDED_REPOS = new Set(['Portfolio', 'portfolio', `${GITHUB_USERNAME}.github.io`]);
const GITHUB_API_HEADERS = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const README_WEBSITE_LABEL_REGEX = /(website|live|demo|app|deployed|preview)/i;

const toValidHttpUrl = (value) => {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim()
    .replace(/^[("'`<[]+/, '')
    .replace(/[)"'`>\],.;:!?]+$/, '')
    .replace(/`/g, '');
  if (!cleaned) return null;
  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch { return null; }
};

const isLikelyProjectWebsite = (url) => {
  try {
    const { hostname } = new URL(url);
    return (
      !hostname.endsWith('github.com') &&
      hostname !== 'raw.githubusercontent.com' &&
      hostname !== 'img.shields.io' &&
      hostname !== 'shields.io'
    );
  } catch { return false; }
};

const decodeBase64Utf8 = (value) => {
  try {
    const binary = atob(value.replace(/\n/g, ''));
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch { return ''; }
};

const extractWebsiteFromReadme = (markdown) => {
  if (!markdown) return null;
  const links = [];
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;
  let match = pattern.exec(markdown);
  while (match) {
    const url = toValidHttpUrl(match[2]);
    if (url && isLikelyProjectWebsite(url)) links.push({ label: match[1], url });
    match = pattern.exec(markdown);
  }
  const labeled = links.find(l => README_WEBSITE_LABEL_REGEX.test(l.label));
  if (labeled) return labeled.url;
  if (links.length > 0) return links[0].url;
  const barePattern = /https?:\/\/[^\s)\]>]+/gi;
  let urlMatch = barePattern.exec(markdown);
  while (urlMatch) {
    const url = toValidHttpUrl(urlMatch[0]);
    if (url && isLikelyProjectWebsite(url)) return url;
    urlMatch = barePattern.exec(markdown);
  }
  return null;
};

const fetchWebsiteFromReadme = async (repoName, signal) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
      { signal, headers: GITHUB_API_HEADERS },
    );
    if (!response.ok) return null;
    const readme = await response.json();
    if (!readme || typeof readme.content !== 'string') return null;
    return extractWebsiteFromReadme(decodeBase64Utf8(readme.content));
  } catch { return null; }
};

const buildTags = (repo) => {
  const tags = new Set();
  if (Array.isArray(repo.topics)) repo.topics.slice(0, 4).forEach(t => tags.add(t));
  if (repo.language) tags.add(repo.language);
  return Array.from(tags);
};

const normalizeRepos = (repos) =>
  repos
    .filter(r => !r.fork && !r.archived && !EXCLUDED_REPOS.has(r.name))
    .sort((a, b) => {
      const af = FEATURED_REPOS.has(a.name), bf = FEATURED_REPOS.has(b.name);
      if (af !== bf) return af ? -1 : 1;
      return new Date(b.pushed_at) - new Date(a.pushed_at);
    })
    .slice(0, MAX_PROJECTS)
    .map(r => ({
      title: r.name,
      repoName: r.name,
      description: r.description || 'No description provided.',
      tags: buildTags(r),
      link: r.html_url,
      website: toValidHttpUrl(r.homepage),
      language: r.language || 'Other',
      featured: FEATURED_REPOS.has(r.name),
    }));

function ProjectCard({ project, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 60);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="project-card"
      style={{
        opacity: 0,
        transform: 'translateY(16px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
          {/* Index */}
          <span
            className="label"
            style={{ color: 'var(--c-text-ghost)', display: 'block', marginBottom: '0.5rem' }}
          >
            {String(index + 1).padStart(2, '0')}{project.featured ? ' · featured' : ''}
          </span>
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--c-text)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {project.title.replace(/-/g, ' ')}
          </h3>
        </div>
        {/* Language dot */}
        <div
          title={project.language}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--c-amber)',
              opacity: project.featured ? 1 : 0.45,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            className="label"
            style={{ color: 'var(--c-text-ghost)', fontSize: '0.62rem' }}
          >
            {project.language}
          </span>
        </div>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: 'Source Serif 4, serif',
          fontSize: '0.9rem',
          color: 'var(--c-text-dim)',
          lineHeight: 1.7,
          margin: 0,
          flex: 1,
        }}
      >
        {project.description}
      </p>

      {/* Tags */}
      {project.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {project.tags.map(tag => (
            <span
              key={tag}
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
                padding: '0.2rem 0.55rem',
                border: '1px solid var(--c-border)',
                color: 'var(--c-text-ghost)',
                textTransform: 'lowercase',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderTop: '1px solid var(--c-border)',
          paddingTop: '1rem',
        }}
      >
        {project.website && (
          <a
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 600,
              fontSize: '0.68rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--c-amber)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Live Demo
            <ArrowUpRight style={{ width: '12px', height: '12px' }} />
          </a>
        )}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: '0.68rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--c-text-dim)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text-dim)')}
        >
          GitHub
          <ArrowUpRight style={{ width: '12px', height: '12px' }} />
        </a>
      </div>
    </div>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [languageFilter, setLanguageFilter] = useState('All');
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-reveal]').forEach((el, i) => {
            el.style.transitionDelay = `${i * 0.1}s`;
            el.classList.add('visible');
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  const languages = useMemo(() => {
    const unique = new Set(projects.map(p => p.language).filter(Boolean));
    return ['All', ...Array.from(unique).sort()];
  }, [projects]);

  const filteredProjects = useMemo(
    () => languageFilter === 'All' ? projects : projects.filter(p => p.language === languageFilter),
    [languageFilter, projects],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
          { signal: controller.signal, headers: GITHUB_API_HEADERS },
        );
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repos = await response.json();
        if (!Array.isArray(repos)) throw new Error('Unexpected response from GitHub.');

        const normalized = normalizeRepos(repos);
        const withWebsites = await Promise.all(
          normalized.map(async p => {
            if (p.website) return p;
            const website = await fetchWebsiteFromReadme(p.repoName, controller.signal);
            return { ...p, website };
          }),
        );

        if (!controller.signal.aborted) setProjects(withWebsites);
      } catch (err) {
        if (!controller.signal.aborted) setError(err);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    loadProjects();
    return () => controller.abort();
  }, []);

  return (
    <section
      id="projects"
      style={{
        padding: 'clamp(5rem, 10vw, 8rem) 0',
        background: 'var(--c-bg)',
        borderBottom: '1px solid var(--c-border)',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Header */}
        <div ref={headerRef} style={{ marginBottom: '3.5rem' }}>
          <div data-reveal className="section-enter">
            <span className="label">02 — Work</span>
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
                Selected Projects
              </h2>
              <div style={{ flex: 1, height: '1px', background: 'var(--c-border)', maxWidth: '120px' }} />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <span
              className="label"
              style={{ color: 'var(--c-text-ghost)', display: 'block', marginBottom: '1rem' }}
            >
              Loading
            </span>
            <div
              style={{
                width: '40px',
                height: '1px',
                background: 'var(--c-amber)',
                margin: '0 auto',
                animation: 'fadeIn 0.8s ease infinite alternate',
              }}
            />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p
              style={{
                fontFamily: 'Source Serif 4, serif',
                color: 'var(--c-text-dim)',
                marginBottom: '1.5rem',
              }}
            >
              Couldn't load projects right now.
            </p>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 600,
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '0.7rem 1.5rem',
                border: '1px solid var(--c-amber-20)',
                color: 'var(--c-amber)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              View GitHub Profile
              <ArrowUpRight style={{ width: '13px', height: '13px' }} />
            </a>
          </div>
        ) : (
          <>
            {/* Language filter */}
            {languages.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                {languages.map(lang => (
                  <button
                    key={lang}
                    className={`filter-pill${languageFilter === lang ? ' active' : ''}`}
                    onClick={() => setLanguageFilter(lang)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}

            {filteredProjects.length === 0 ? (
              <p style={{ fontFamily: 'Source Serif 4, serif', color: 'var(--c-text-dim)', textAlign: 'center' }}>
                No projects match that filter.
              </p>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: '1.5px',
                  gridTemplateColumns: '1fr',
                }}
                className="sm:grid-cols-2 lg:grid-cols-3"
              >
                {filteredProjects.map((project, i) => (
                  <ProjectCard key={project.title} project={project} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
