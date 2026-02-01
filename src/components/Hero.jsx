import { Button } from '@/components/ui/button';

const heroImage = new URL('/hero-photo.png', import.meta.url).href;

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl relative z-10 grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center justify-items-center px-4 md:px-6 pt-24 pb-20">
        <div className="space-y-6 max-w-xl text-center lg:text-left">
          <p className="text-sm font-medium tracking-widest text-primary uppercase">
            Hello, I'm
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="block">Haniel</span>
            <span className="block text-primary">Thomson</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Software Engineer with experience in computer vision, ML, and full-stack development.
            Recently at Amazon Robotics building real-time systems. MS in Computer Science from Boston University.
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Button asChild size="lg">
              <a href="#projects">View Projects</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#contact">Get in Touch</a>
            </Button>
          </div>
        </div>

        <div className="relative order-first lg:order-last w-full max-w-md lg:max-w-lg mx-auto">
          <div className="relative aspect-[4/5] w-full max-h-[500px] lg:max-h-[600px] rounded-2xl overflow-hidden border shadow-2xl bg-muted">
            <img
              src={heroImage}
              alt="Haniel Thomson"
              className="w-full h-full object-cover object-[center_35%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
