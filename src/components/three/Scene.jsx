import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';
import NeuralField from './NeuralField';

// Radial fade so the field dissolves toward the edges, matching the existing
// hero dot-grid mask.
const MASK = 'radial-gradient(ellipse 75% 75% at 50% 45%, #000 35%, transparent 100%)';

// Lazy-loaded 3D entry point. Wraps NeuralField in a transparent, click-through
// Canvas configured as a decorative background layer. `active` drives frameloop
// so the render loop stops when the section is off screen or the tab is hidden.
export default function Scene({
  active = true,
  count,
  connectionDist,
  scale,
  opacity,
  parallax = true,
  camera,
}) {
  const { theme } = useTheme();
  const pointer = useRef({ x: 0, y: 0 });

  // Pull the amber accent straight from the theme's CSS var so light/dark match.
  const [color, setColor] = useState(() => new THREE.Color('#F0A429'));
  useEffect(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--c-amber')
      .trim();
    setColor(new THREE.Color(raw || '#F0A429'));
  }, [theme]);

  useEffect(() => {
    if (!parallax) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const onMove = (e) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [parallax]);

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={camera ?? { position: [0, 0, 14], fov: 60 }}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        maskImage: MASK,
        WebkitMaskImage: MASK,
      }}
    >
      <NeuralField
        color={color}
        count={count}
        connectionDist={connectionDist}
        scale={scale}
        opacity={opacity}
        pointer={parallax ? pointer : undefined}
      />
    </Canvas>
  );
}
