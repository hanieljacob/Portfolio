import { Fragment, useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useMagnetic } from '@/hooks/useMagnetic';

const headline = [
  { text: 'Intelligent' },
  { text: 'systems,' },
  { text: 'built' },
  { text: 'for' },
  { text: 'the' },
  { text: 'real', accent: true },
  { text: 'world.', accent: true },
];

const tickerItems = [
  'AI Agents',
  'LLM Systems',
  'RAG Pipelines',
  'Machine Learning',
  'Python',
  'React',
  'AWS',
  'Distributed Systems',
  'CI/CD',
  'Great Design',
];

export default function Hero() {
  const sectionRef = useRef(null);
  const primaryRef = useMagnetic(0.18);
  const secondaryRef = useMagnetic(0.18);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = null;
    const update = () => {
      frame = null;
      const progress = Math.min(Math.max(-el.getBoundingClientRect().top / window.innerHeight, 0), 1);
      el.style.setProperty('--hero-shift', progress.toFixed(3));
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="hero" id="top" ref={sectionRef}>
      <div className="hero-aura" aria-hidden="true" />
      <div className="hero-sweep" aria-hidden="true" />
      <div className="hero-sweep hero-sweep--slow" aria-hidden="true" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow eyebrow--accent hero-kicker">
            Haniel Thomson · Software Engineer
          </span>

          <h1 className="hero-title">
            {headline.map((word, i) => (
              <Fragment key={`${word.text}-${i}`}>
                <span
                  className={`hero-word${word.accent ? ' gradient-text' : ''}`}
                  style={{ '--word-index': i }}
                >
                  {word.text}
                </span>
                {i < headline.length - 1 ? ' ' : null}
                {i === 1 ? <br /> : null}
              </Fragment>
            ))}
          </h1>

          <p className="hero-lead">
            I build <strong>AI agents and language model products</strong>. My work
            spans live machine learning systems at Amazon Robotics and tools that
            turn complex data into something useful.
          </p>

          <div className="hero-actions">
            <a ref={primaryRef} className="btn btn--primary" href="#projects">
              View selected work
              <ArrowRight size={16} strokeWidth={1.8} />
            </a>
            <a ref={secondaryRef} className="btn btn--secondary" href="#contact">
              Get in touch
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </a>
          </div>

          <div className="hero-status">
            <span className="status-dot" aria-hidden="true" />
            Open to new roles and interesting collaborations
          </div>
        </div>

        <div className="hero-portrait">
          <img src="/hero-photo-color.jpg" alt="Portrait of Haniel Thomson" />
        </div>
      </div>

      <div className="hero-ticker" aria-hidden="true">
        <div className="hero-ticker-track">
          {[0, 1].map((copy) => (
            <div className="hero-ticker-group" key={copy}>
              {tickerItems.map((item) => (
                <span className="hero-ticker-item" key={`${copy}-${item}`}>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
