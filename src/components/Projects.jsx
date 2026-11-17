import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const GITHUB_USERNAME = 'hanieljacob';

const FILTERS = ['Python', 'React', 'AI Agents', 'Data', 'Systems'];

const CURATED_PROJECTS = [
  {
    repo: 'agent-concurrency-eval',
    title: 'Agent Concurrency Eval',
    featured: true,
    description:
      'An evaluation task that tests whether coding agents can fix concurrency bugs they cannot reproduce by running tests. Five defects hide in a lock free ring buffer, two of them guarded by confident but wrong comments, and a deterministic grader exposes what passing smoke tests miss.',
    tags: ['Python', 'Concurrency', 'Evaluation', 'Systems'],
    thumbnail: '/projects/concurrency.svg',
  },
  {
    repo: 'Agentic-Email-Parser',
    title: 'Agentic Email Parser',
    featured: true,
    description:
      'An agent that reads supplier emails, extracts purchase order changes, resolves them against canonical records, and applies only the edits it can justify. Low confidence changes go to a human review queue, and every write is protected by an optimistic lock and an immutable audit trail.',
    tags: ['Python', 'AI Agents', 'Extraction', 'Automation'],
    thumbnail: '/projects/agents.svg',
  },
  {
    repo: 'policy-rag-mcp',
    title: 'Policy RAG MCP',
    featured: true,
    description:
      'A retrieval augmented assistant for policy documents, exposed to MCP hosts as tools. It runs locally with Ollama or in the cloud with Bedrock and OpenSearch, and ships an evaluation harness so answer quality is measured rather than assumed.',
    tags: ['Python', 'AI Agents', 'RAG', 'Systems'],
    thumbnail: '/projects/rag.svg',
  },
  {
    repo: 'Financial-Data-Extraction',
    title: 'Financial Data Extraction',
    featured: false,
    description:
      'An LLM pipeline that pulls operating income, stockholders equity, and capital expenditures from SEC 10 K filings. It downloads 30 annual reports, scales units against XBRL facts from the same filing, and scores every extraction.',
    tags: ['Python', 'Data', 'LLM', 'SEC Filings'],
    thumbnail: '/projects/analytics.svg',
  },
  {
    repo: 'QMS-trace',
    title: 'QMS Trace',
    featured: false,
    description:
      'A traceability system for a medical device manufacturer that answers what went into a serial number and which units consumed a supplier lot. It walks a four level bill of materials, flags failed inspections and missing certificates, and exports audit ready device history records.',
    tags: ['Python', 'Data', 'Systems', 'Traceability'],
    thumbnail: '/projects/qms.svg',
  },
  {
    repo: 'Stratosphere',
    title: 'Stratosphere',
    featured: false,
    description:
      'A real time explorer for atmospheric balloon flights built with React 19 and MapLibre. It plots live trajectories on a dark world map, lets you filter the fleet and inspect altitude, temperature, and wind profiles, and makes every selection shareable through the URL.',
    tags: ['React', 'Data', 'MapLibre', 'Visualization'],
    thumbnail: '/projects/stratosphere.svg',
  },
];

function buildProjects(repos) {
  const byName = new Map((repos || []).map((r) => [r.name, r]));
  return CURATED_PROJECTS.map((project) => {
    const repo = byName.get(project.repo);
    return {
      ...project,
      link: repo?.html_url || `https://github.com/${GITHUB_USERNAME}/${project.repo}`,
    };
  });
}

function ProjectCard({ project, index, activeTags, onTagToggle }) {
  const onMove = (event) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 12}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 14}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };

  const onLeave = (event) => {
    const el = event.currentTarget;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      className="project-card"
      data-reveal
      style={{ '--card-index': index }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="project-card-inner">
        <div className="project-card-spotlight" aria-hidden="true" />
        <div className="project-media">
          <img src={project.thumbnail} alt="" loading="lazy" />
        </div>
        <div className="project-body">
          <div className="project-meta">
            <span>{project.featured ? 'Featured' : 'Project'}</span>
            {project.tags[0] && (
              <>
                <span className="meta-dot" />
                <span>{project.tags[0]}</span>
              </>
            )}
          </div>

          <h3 className="project-title">{project.title}</h3>
          <p className="project-desc">{project.description}</p>

          {project.tags.length > 1 && (
            <div className="project-tags">
              {project.tags.slice(1).map((tag) => (
                <button
                  className="tag"
                  type="button"
                  key={tag}
                  data-active={activeTags.includes(tag)}
                  aria-pressed={activeTags.includes(tag)}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <a
            className="project-link"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>View on GitHub</span>
            <ArrowUpRight size={17} strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTags, setActiveTags] = useState([]);

  useReveal(ref, `${projects.length}:${activeTags.join(',')}`);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
          {
            signal: controller.signal,
            headers: {
              Accept: 'application/vnd.github+json',
              'X-GitHub-Api-Version': '2022-11-28',
            },
          },
        );
        if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
        const repos = await response.json();
        if (!Array.isArray(repos)) throw new Error('Unexpected response');
        if (!controller.signal.aborted) setProjects(buildProjects(repos));
      } catch {
        if (!controller.signal.aborted) setProjects(buildProjects([]));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  const filterTags = useMemo(
    () => [...new Set([...FILTERS, ...activeTags])],
    [activeTags],
  );

  const toggleTag = (tag) => {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const visible = activeTags.length
    ? projects.filter((project) => project.tags.some((tag) => activeTags.includes(tag)))
    : projects;

  return (
    <section className="section" id="projects" ref={ref}>
      <div className="container">
        <div className="projects-head">
          <div className="section-head" data-reveal>
            <span className="eyebrow">Selected work</span>
            <h2 className="section-title">Things I&apos;ve built.</h2>
            <p className="section-intro">
              A few recent projects spanning AI systems, data infrastructure,
              and interfaces that make complex things feel simple.
            </p>
          </div>
          <a
            className="text-link"
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
          >
            <Github size={16} strokeWidth={1.8} />
            All repositories
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </a>
        </div>

        {!isLoading && (
          <div className="filters" data-reveal>
            <button
              type="button"
              className="filter"
              data-active={activeTags.length === 0}
              aria-pressed={activeTags.length === 0}
              onClick={() => setActiveTags([])}
            >
              All
            </button>
            {filterTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className="filter"
                data-active={activeTags.includes(tag)}
                aria-pressed={activeTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
            {activeTags.length > 0 && (
              <span className="filter-count">
                {visible.length} {visible.length === 1 ? 'project' : 'projects'}
              </span>
            )}
          </div>
        )}

        {isLoading ? (
          <p className="projects-empty" data-reveal>Loading projects…</p>
        ) : visible.length === 0 ? (
          <p className="projects-empty" data-reveal>No projects match those tags.</p>
        ) : (
          <div className="project-grid" key={activeTags.join(',')}>
            {visible.map((project, index) => (
              <ProjectCard
                key={project.repo}
                project={project}
                index={index}
                activeTags={activeTags}
                onTagToggle={toggleTag}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
