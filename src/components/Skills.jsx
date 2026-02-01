import { Card, CardContent, CardHeader } from '@/components/ui/card';

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Java', 'Python', 'TypeScript', 'JavaScript', 'Kotlin', 'SQL', 'HTML', 'CSS', 'C#'],
  },
  {
    title: 'Frameworks',
    skills: ['React', 'Node.js', 'Express', 'Spring Boot', 'Django', 'Unity'],
  },
  {
    title: 'Tools & Technologies',
    skills: ['AWS', 'PostgreSQL', 'MongoDB', 'Git', 'Docker', 'Auth0', 'Jenkins'],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & Tools</h2>
          <div className="h-1 w-14 bg-primary rounded-full mx-auto mb-4" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {skillCategories.map((category) => (
            <Card key={category.title} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <h3 className="text-sm font-medium uppercase tracking-wider text-primary">
                  {category.title}
                </h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.skills.map((skill) => (
                    <li key={skill} className="text-sm text-muted-foreground border-b border-border/50 pb-2 last:border-0 last:pb-0">
                      {skill}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
