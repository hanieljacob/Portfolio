import { useRef } from 'react';
import CountUp from './CountUp';
import { useReveal } from '@/hooks/useReveal';

const stats = [
  { value: 180, suffix: '%', label: 'Sales growth for manufacturing customers' },
  { value: 99.6, decimals: 1, suffix: '%', label: 'Accuracy extracting fields from RFQs' },
  { value: 96, suffix: '%', label: 'Less manual smoke testing at Amazon Robotics' },
];

const focusAreas = [
  'Python',
  'AWS',
  'TypeScript',
  'React',
  'Kotlin',
];

export default function About() {
  const ref = useRef(null);
  useReveal(ref);

  return (
    <section className="section section--subtle" id="about" ref={ref}>
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">About</span>
          <h2 className="section-title">I build AI systems that move real numbers.</h2>
        </div>

        <div className="about-grid">
          <div data-reveal>
            <p className="about-lead">
              I&apos;m Haniel Thomson, a software engineer with a Master of Science
              in Computer Science from <em>Boston University</em>. I&apos;ve built
              production systems at Tarvo AI and Amazon Robotics.
            </p>
            <p className="about-body">
              At <em>Tarvo AI</em> I replaced slow manual quoting with an automated
              platform that processes more than 500 RFQs a week and lifted sales
              about 180 percent for manufacturers. A multi step LLM harness pulls
              structured fields from email attachments, CAD, PDFs and spreadsheets
              at 99.6 percent accuracy, and a deterministic pricing graph cut
              customer onboarding from three hours to ten minutes.
            </p>
            <p className="about-body">
              At <em>Amazon Robotics</em> I built the low latency testing and
              release infrastructure behind package identification technology now
              running across more than a million robots in over 300 facilities. A
              concurrent Kotlin and C++ service with lock free disruptors cut smoke
              testing about 96 percent, and CDK based deploys with regional ECR
              images saved 30 minutes per release and 60 percent on provisioning.
            </p>
            <p className="about-body">
              I own the full arc, from architecture and implementation to tests and
              the CI/CD that ships it.
            </p>

            <div className="chips">
              {focusAreas.map((area) => (
                <span className="chip" key={area}>{area}</span>
              ))}
            </div>
          </div>

          <div className="stats" data-reveal>
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <div className="stat-value">
                  <CountUp
                    to={stat.value}
                    decimals={stat.decimals || 0}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
