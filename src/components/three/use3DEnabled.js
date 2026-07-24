import { useEffect, useState } from 'react';

// Cheap WebGL availability probe — a throwaway canvas, run once per evaluation.
function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Decides whether the decorative 3D layer should render at all. Returns false for
// reduced-motion, small/mobile viewports, obviously low-core devices, or missing
// WebGL — callers fall back to the existing CSS dot-grid / glow layers.
export function use3DEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    const compute = () => {
      if (reduce.matches) return false;
      if (window.innerWidth < 768) return false;
      const cores = navigator.hardwareConcurrency;
      if (cores && cores < 4) return false;
      return hasWebGL();
    };

    const update = () => setEnabled(compute());
    update();

    reduce.addEventListener?.('change', update);
    window.addEventListener('resize', update);
    return () => {
      reduce.removeEventListener?.('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return enabled;
}
