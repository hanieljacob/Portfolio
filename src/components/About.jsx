import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="h-1 w-14 bg-primary rounded-full mx-auto mb-4" />
        </div>
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-4 text-muted-foreground">
            <p>
              I'm a Software Engineer with a Master's in Computer Science from Boston University,
              specializing in data-centric computing. I've built real-time computer vision systems
              at Amazon Robotics, developed e-commerce platforms, and created research tools using
              Unity and C#.
            </p>
            <p>
              I enjoy solving complex problems—from automating CI/CD pipelines that cut release
              time by 90%, to building LLM-powered agents. I'm based in San Francisco and open
              to opportunities worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { value: '3+', label: 'Years Experience' },
              { value: '175+', label: 'Fulfillment Centers Supported' },
              { value: '90%', label: 'Release Time Reduced' },
            ].map((stat) => (
              <Card key={stat.label} className="transition-shadow hover:shadow-md">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
