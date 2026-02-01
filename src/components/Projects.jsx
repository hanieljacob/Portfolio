import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'Daily-Digest',
    description: 'A daily digest Slack bot that generates daily summaries from channel messages, supporting multimodal inputs (images, PDFs, documents, etc.) using Google\'s Gemini API. Features include thread expansion, event deduplication, and automatic summarization with To-Do and General Updates sections.',
    tags: ['JavaScript', 'Node.js', 'Slack API', 'Google Gemini API', 'Multimodal Processing'],
    link: 'https://github.com/hanieljacob/Daily-Digest',
    featured: true,
  },
  {
    title: 'Windborne Dashboard',
    description: 'A real-time visualization application for Windborne\'s global balloon constellation. Displays balloon data on an interactive map with integrated weather information from Open-Meteo API. Features include click-to-view details, responsive design, and robust data fetching with fallback mechanisms.',
    tags: ['React', 'TypeScript', 'Leaflet.js', 'Vite', 'Open-Meteo API', 'Real-time Visualization'],
    link: 'https://github.com/hanieljacob/Windborne-dashboard',
    featured: true,
  },
  {
    title: 'Meet-Deetz',
    description: 'An Android application developed in Kotlin. Project includes modern Android development practices with Gradle build system and follows standard Android project architecture.',
    tags: ['Kotlin', 'Android', 'Mobile App', 'Gradle'],
    link: 'https://github.com/hanieljacob/Meet-Deetz',
    featured: false,
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Selected Work</h2>
          <div className="h-1 w-14 bg-primary rounded-full mx-auto mb-4" />
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {projects.map((project) => (
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
              <CardFooter className="pt-0">
                <Button variant="ghost" size="sm" asChild className="group/btn -ml-2">
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    View Project
                    <ArrowUpRight className="size-4 ml-1 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover/btn:opacity-100 group-hover/btn:translate-y-0 group-hover/btn:translate-x-0 transition-all" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
