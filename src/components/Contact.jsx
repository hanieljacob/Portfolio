import { Card, CardContent } from '@/components/ui/card';

const links = [
  { label: 'Email', value: 'haniel.thomson@gmail.com', href: 'mailto:haniel.thomson@gmail.com' },
  { label: 'Resume', value: 'Download PDF', href: '/HanielThomson_Resume.pdf' },
  { label: 'GitHub', value: 'github.com/hanieljacob', href: 'https://github.com/hanieljacob' },
  { label: 'LinkedIn', value: 'linkedin.com/in/haniel-jacob', href: 'https://www.linkedin.com/in/haniel-jacob/' },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-muted-foreground mb-12">
            Have a project in mind or just want to say hi? I'd love to hear from you.
            Drop me a message and I'll get back to you soon.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') || link.href.startsWith('mailto') || link.href.endsWith('.pdf') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block"
              >
                <Card className="transition-all hover:border-primary/50 hover:shadow-md group h-full">
                  <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                    <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {link.label}
                    </span>
                    <span className="mt-1 font-medium group-hover:text-primary transition-colors">
                      {link.value}
                    </span>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
