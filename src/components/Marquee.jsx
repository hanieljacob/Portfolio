const items = [
  'AI Agents',
  'LLM Systems',
  'RAG Pipelines',
  'Machine Learning',
  'Python',
  'Real-Time Systems',
  'React',
  'AWS',
  'Distributed Backends',
  'CI/CD',
];

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map(copy => (
          <div className="marquee-group" key={copy}>
            {items.map(item => (
              <span className="marquee-item" key={`${copy}-${item}`}>
                <span className="marquee-star">✦</span>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
