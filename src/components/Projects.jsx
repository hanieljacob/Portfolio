import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  if (typeof value !== 'string') {
    return null;
  }

  const cleanedValue = value
    .trim()
    .replace(/^[("'`<\[]+/, '')
    .replace(/[)"'`>\],.;:!?]+$/, '')
    .replace(/`/g, '');
  if (!cleanedValue) {
    return null;
  }

  try {
    const parsedUrl = new URL(cleanedValue);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
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
  } catch {
    return false;
  }
};

const decodeBase64Utf8 = (value) => {
  try {
    const normalized = value.replace(/\n/g, '');
    const binary = atob(normalized);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
};

const extractWebsiteFromReadme = (markdown) => {
  if (!markdown) {
    return null;
  }

  const markdownLinks = [];
  const markdownLinkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/gi;
  let match = markdownLinkPattern.exec(markdown);

  while (match) {
    const label = match[1];
    const url = toValidHttpUrl(match[2]);

    if (url && isLikelyProjectWebsite(url)) {
      markdownLinks.push({ label, url });
    }

    match = markdownLinkPattern.exec(markdown);
  }

  const labeledWebsiteLink = markdownLinks.find((link) =>
    README_WEBSITE_LABEL_REGEX.test(link.label),
  );

  if (labeledWebsiteLink) {
    return labeledWebsiteLink.url;
  }

  if (markdownLinks.length > 0) {
    return markdownLinks[0].url;
  }

  const bareUrlPattern = /https?:\/\/[^\s)\]>]+/gi;
  let urlMatch = bareUrlPattern.exec(markdown);

  while (urlMatch) {
    const url = toValidHttpUrl(urlMatch[0]);
    if (url && isLikelyProjectWebsite(url)) {
      return url;
    }
    urlMatch = bareUrlPattern.exec(markdown);
  }

  return null;
};

const fetchWebsiteFromReadme = async (repoName, signal) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
      {
        signal,
        headers: GITHUB_API_HEADERS,
      },
    );

    if (!response.ok) {
      return null;
    }

    const readme = await response.json();
    if (!readme || typeof readme.content !== 'string') {
      return null;
    }

    const markdown = decodeBase64Utf8(readme.content);
    return extractWebsiteFromReadme(markdown);
  } catch {
    return null;
  }
};

const buildTags = (repo) => {
  const tags = new Set();

  if (Array.isArray(repo.topics)) {
    repo.topics.slice(0, 5).forEach((topic) => tags.add(topic));
  }

  if (repo.language) {
    tags.add(repo.language);
  }

  if (repo.stargazers_count > 0) {
    tags.add(`${repo.stargazers_count} stars`);
  }

  return Array.from(tags);
};

const normalizeRepos = (repos) =>
  repos
    .filter((repo) => !repo.fork && !repo.archived && !EXCLUDED_REPOS.has(repo.name))
    .sort((a, b) => {
      const aFeatured = FEATURED_REPOS.has(a.name);
      const bFeatured = FEATURED_REPOS.has(b.name);

      if (aFeatured !== bFeatured) {
        return aFeatured ? -1 : 1;
      }

      return new Date(b.pushed_at) - new Date(a.pushed_at);
    })
    .slice(0, MAX_PROJECTS)
    .map((repo) => ({
      title: repo.name,
      repoName: repo.name,
      description: repo.description || 'No description provided.',
      tags: buildTags(repo),
      link: repo.html_url,
      website: toValidHttpUrl(repo.homepage),
      language: repo.language || 'Other',
      featured: FEATURED_REPOS.has(repo.name),
    }));

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [languageFilter, setLanguageFilter] = useState('All');

  const languages = useMemo(() => {
    const uniqueLanguages = new Set();

    projects.forEach((project) => {
      if (project.language) {
        uniqueLanguages.add(project.language);
      }
    });

    return ['All', ...Array.from(uniqueLanguages).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (languageFilter === 'All') {
      return projects;
    }

    return projects.filter((project) => project.language === languageFilter);
  }, [languageFilter, projects]);

  useEffect(() => {
    const controller = new AbortController();

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
          {
            signal: controller.signal,
            headers: GITHUB_API_HEADERS,
          },
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();

        if (!Array.isArray(repos)) {
          throw new Error('Unexpected response from GitHub.');
        }

        const normalizedProjects = normalizeRepos(repos);
        const projectsWithWebsites = await Promise.all(
          normalizedProjects.map(async (project) => {
            if (project.website) {
              return project;
            }

            const website = await fetchWebsiteFromReadme(project.repoName, controller.signal);
            return {
              ...project,
              website,
            };
          }),
        );

        if (!controller.signal.aborted) {
          setProjects(projectsWithWebsites);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => controller.abort();
  }, []);

  return (
    <section id="projects" className="py-24 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected Work</h2>
          <div className="h-1 w-14 bg-primary rounded-full mx-auto mb-4" />
        </div>
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading projects...</p>
        ) : error ? (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Couldn&apos;t load projects right now.
            </p>
            <Button asChild>
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View GitHub Profile
                <ArrowUpRight className="size-4 ml-1" />
              </a>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {languages.map((language) => (
                <Button
                  key={language}
                  size="sm"
                  variant={languageFilter === language ? 'default' : 'secondary'}
                  onClick={() => setLanguageFilter(language)}
                >
                  {language}
                </Button>
              ))}
            </div>
            {filteredProjects.length === 0 ? (
              <p className="text-center text-muted-foreground">
                No projects match that filter yet.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.title}
                    className={`group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 ${
                      project.featured ? 'border-primary/20' : ''
                    }`}
                  >
                    <CardHeader>
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex items-center flex-wrap gap-1">
                      {project.website ? (
                        <Button variant="ghost" size="sm" asChild className="group/btn">
                          <a href={project.website} target="_blank" rel="noopener noreferrer">
                            Visit Website
                            <ArrowUpRight className="size-4 ml-1 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 group-hover/btn:translate-x-0 transition-all" />
                          </a>
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="sm" asChild className="group/btn">
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          View Project
                          <ArrowUpRight className="size-4 ml-1 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 group-hover/btn:translate-x-0 transition-all" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
