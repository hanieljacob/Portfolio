import { createElement, useRef } from 'react';
import { Boxes, Code2, GraduationCap, Wrench } from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const categories = [
  {
    title: 'Languages',
    icon: Code2,
    skills: ['Java', 'Python', 'TypeScript', 'JavaScript', 'Kotlin', 'SQL', 'C#'],
  },
  {
    title: 'Frameworks',
    icon: Boxes,
    skills: ['React', 'Node.js', 'Express', 'Spring Boot', 'Django', 'Unity'],
  },
  {
    title: 'Tools & Infrastructure',
    icon: Wrench,
    skills: ['AWS', 'PostgreSQL', 'MongoDB', 'Docker', 'Git', 'Jenkins', 'Auth0'],
  },
];

export default function Skills() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section className="section section--subtle" id="skills" ref={ref}>
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Capabilities</span>
          <h2 className="section-title">Tools of the trade.</h2>
        </div>

        <div className="skill-grid">
          {categories.map(({ title, icon, skills }) => (
            <div className="skill-card" key={title} data-reveal>
              <div className="skill-icon">
                {createElement(icon, { size: 20, strokeWidth: 1.7 })}
              </div>
              <h3>{title}</h3>
              <ul className="skill-list">
                {skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="education" data-reveal>
          <div className="education-main">
            <GraduationCap size={24} strokeWidth={1.6} />
            <div>
              <span className="education-label">Education</span>
              <span className="education-value">
                M.S. Computer Science, Boston University
              </span>
            </div>
          </div>
          <span className="education-note">Data Centric Computing</span>
        </div>
      </div>
    </section>
  );
}
