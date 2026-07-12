import { useEffect, useState } from 'react';

const MIN_DURATION = 1600;
// Hard ceiling. rAF is throttled in background tabs, so the counter alone could
// stall indefinitely and strand the visitor on the loading screen.
const MAX_DURATION = 5000;

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Ease progress toward 100, gated by both a minimum duration and window load
  useEffect(() => {
    let frame;
    let exitTimer;
    let done = false;
    let pageLoaded = document.readyState === 'complete';
    const onLoad = () => { pageLoaded = true; };
    window.addEventListener('load', onLoad);

    const startedAt = performance.now();
    let current = 0;

    const finish = () => {
      if (done) return;
      done = true;
      current = 100;
      setProgress(100);
      setExiting(true);
      exitTimer = setTimeout(onComplete, 1050);
    };

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const timeRatio = Math.min(elapsed / MIN_DURATION, 1);
      // Ease-out so the counter decelerates, and hold at 92 until the page is loaded
      const target = (pageLoaded ? 100 : 92) * (1 - Math.pow(1 - timeRatio, 3));

      current += (target - current) * 0.12;
      if (current > 99.6) {
        finish();
        return;
      }
      setProgress(current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const watchdog = setTimeout(finish, MAX_DURATION);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(watchdog);
      clearTimeout(exitTimer);
      window.removeEventListener('load', onLoad);
    };
  }, [onComplete]);

  const rounded = Math.round(progress);

  return (
    <div className={`preloader${exiting ? ' preloader-exit' : ''}`} aria-hidden={exiting}>
      <div className="preloader-grid" aria-hidden="true" />

      <div className="preloader-inner">
        <div className="preloader-mark">
          <span className="preloader-dot" aria-hidden="true" />
          <span className="label">Portfolio</span>
        </div>

        <h1 className="preloader-name">
          <span className="preloader-line">
            <span className="preloader-word">HANIEL</span>
          </span>
          <span className="preloader-line">
            <span className="preloader-word preloader-word-outline">THOMSON</span>
          </span>
        </h1>

        <div className="preloader-meta">
          <span className="label preloader-status">
            {rounded < 40
              ? 'Initializing'
              : rounded < 80
                ? 'Loading assets'
                : rounded < 100
                  ? 'Almost there'
                  : 'Welcome'}
          </span>
          <span className="preloader-count">{String(rounded).padStart(3, '0')}</span>
        </div>

        <div className="preloader-track">
          <div className="preloader-bar" style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </div>
    </div>
  );
}
