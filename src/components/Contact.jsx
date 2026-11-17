import { createElement, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail, FileText } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const links = [
  {
    label: 'Email',
    value: 'haniel.thomson@gmail.com',
    href: 'mailto:haniel.thomson@gmail.com',
    icon: Mail,
  },
  {
    label: 'GitHub',
    value: 'github.com/hanieljacob',
    href: 'https://github.com/hanieljacob',
    icon: Github,
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/haniel-jacob',
    href: 'https://www.linkedin.com/in/haniel-jacob/',
    icon: Linkedin,
  },
  {
    label: 'Résumé',
    value: 'Download PDF',
    href: '/HanielThomson_Resume.pdf',
    icon: FileText,
  },
];

export default function Contact() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section className="section" id="contact" ref={ref}>
      <div className="container contact-grid">
        <div data-reveal>
          <span className="eyebrow">Contact</span>
          <h2 className="contact-title">
            Let&apos;s build something <span className="gradient-text">great.</span>
          </h2>
          <p className="contact-copy">
            Have a project in mind, an interesting problem to solve, or just want
            to say hello? I&apos;d love to hear from you.
          </p>
          <div className="contact-cta">
            <a className="btn btn--primary" href="mailto:haniel.thomson@gmail.com">
              Start a conversation
              <ArrowRight size={16} strokeWidth={1.8} />
            </a>
          </div>
        </div>

        <div className="contact-list" data-reveal>
          {links.map(({ label, value, href, icon }) => (
            <a
              className="contact-item"
              key={label}
              href={href}
              target={href.startsWith('http') || href.endsWith('.pdf') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              <span>
                <span className="contact-item-label">{label}</span>
                <span className="contact-item-value">{value}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {createElement(icon, { size: 17, strokeWidth: 1.7, style: { color: 'var(--text-tertiary)' } })}
                <ArrowUpRight size={17} strokeWidth={1.7} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
