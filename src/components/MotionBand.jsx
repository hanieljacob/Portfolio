const topRow = [
  'AI Systems',
  'Data Infrastructure',
  'Machine Learning',
  'Product Engineering',
];

const bottomRow = [
  'Built with intent',
  'Amazon Robotics',
  'Boston University',
  'Open to what is next',
];

function MotionRow({ items, reverse }) {
  return (
    <div className={`motion-row${reverse ? ' motion-row--reverse' : ''}`}>
      <div className="motion-track">
        {[0, 1].map((copy) => (
          <div className="motion-group" key={copy}>
            {items.map((item) => (
              <span className="motion-item" key={`${copy}-${item}`}>
                {item}
                <i aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MotionBand() {
  return (
    <div className="motion-band" aria-hidden="true">
      <MotionRow items={topRow} />
      <MotionRow items={bottomRow} reverse />
    </div>
  );
}
