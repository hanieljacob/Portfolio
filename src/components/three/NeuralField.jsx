import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Soft radial sprite used for every node. White so the material `color` (amber)
// tints it under additive blending. Cached module-wide — one texture for all fields.
let glowTexture;
function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

// Builds the resting field: random node home positions plus the fixed set of
// near-neighbour links (constellation topology). Kept at module scope so the
// randomness lives outside React's render path.
function buildField(count, connectionDist, scale) {
  const rx = 8.5 * scale;
  const ry = 5 * scale;
  const rz = 3.2 * scale;

  const positions = new Float32Array(count * 3);
  const home = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const speed = new Float32Array(count);
  const amp = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = (Math.random() * 2 - 1) * rx;
    const y = (Math.random() * 2 - 1) * ry;
    const z = (Math.random() * 2 - 1) * rz;
    home[i3] = positions[i3] = x;
    home[i3 + 1] = positions[i3 + 1] = y;
    home[i3 + 2] = positions[i3 + 2] = z;
    phase[i] = Math.random() * Math.PI * 2;
    speed[i] = 0.15 + Math.random() * 0.35;
    amp[i] = (0.15 + Math.random() * 0.4) * scale;
  }

  const dist2 = connectionDist * connectionDist;
  const pairs = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const dx = home[i * 3] - home[j * 3];
      const dy = home[i * 3 + 1] - home[j * 3 + 1];
      const dz = home[i * 3 + 2] - home[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < dist2) pairs.push(i, j);
    }
  }
  const linePositions = new Float32Array((pairs.length / 2) * 2 * 3);

  return { positions, home, phase, speed, amp, pairs, linePositions };
}

// A drifting field of glowing nodes with lines linking nearby ones — an
// "agent network" constellation. Topology (which nodes connect) is fixed at
// build time from home positions; nodes then sway around home, so links stretch
// and breathe without popping in/out.
export default function NeuralField({
  color,
  count = 110,
  connectionDist = 2.6,
  scale = 1,
  opacity = 1,
  lineOpacity = 0.14,
  blending = THREE.AdditiveBlending,
  pointer,
}) {
  const groupRef = useRef();

  // Field data and its geometries are mutated every frame, so they live in a ref
  // (lazily built once) rather than useMemo — refs are the mutable escape hatch
  // that r3f's imperative frame loop needs. Props are constant per instance.
  const fieldRef = useRef(null);
  if (fieldRef.current === null) {
    const data = buildField(count, connectionDist, scale);
    const pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    const linesGeom = new THREE.BufferGeometry();
    linesGeom.setAttribute('position', new THREE.BufferAttribute(data.linePositions, 3));
    fieldRef.current = { data, pointsGeom, linesGeom };
  }
  const { data, pointsGeom, linesGeom } = fieldRef.current;

  // Release GPU buffers on unmount.
  useEffect(() => {
    const { pointsGeom: pg, linesGeom: lg } = fieldRef.current;
    return () => {
      pg.dispose();
      lg.dispose();
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const { positions, home, phase, speed, amp, pairs, linePositions } = data;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = home[i3] + Math.sin(t * speed[i] + phase[i]) * amp[i];
      positions[i3 + 1] = home[i3 + 1] + Math.cos(t * speed[i] * 0.9 + phase[i]) * amp[i];
      positions[i3 + 2] = home[i3 + 2] + Math.sin(t * speed[i] * 0.7 + phase[i] * 1.3) * amp[i];
    }
    pointsGeom.attributes.position.needsUpdate = true;

    for (let k = 0; k < pairs.length; k += 2) {
      const a = pairs[k] * 3;
      const b = pairs[k + 1] * 3;
      const o = (k / 2) * 6;
      linePositions[o] = positions[a];
      linePositions[o + 1] = positions[a + 1];
      linePositions[o + 2] = positions[a + 2];
      linePositions[o + 3] = positions[b];
      linePositions[o + 4] = positions[b + 1];
      linePositions[o + 5] = positions[b + 2];
    }
    linesGeom.attributes.position.needsUpdate = true;

    const group = groupRef.current;
    if (group) {
      const px = pointer?.current?.x ?? 0;
      const py = pointer?.current?.y ?? 0;
      // Continuous slow yaw + eased pointer tilt.
      const targetY = t * 0.03 + px * 0.5;
      const targetX = py * 0.35;
      group.rotation.y += (targetY - group.rotation.y) * 0.05;
      group.rotation.x += (targetX - group.rotation.x) * 0.05;
    }
  });

  const tex = getGlowTexture();

  return (
    <group ref={groupRef}>
      <points geometry={pointsGeom}>
        <pointsMaterial
          map={tex}
          color={color}
          size={0.5 * scale}
          sizeAttenuation
          transparent
          opacity={opacity}
          depthWrite={false}
          blending={blending}
          alphaTest={0.01}
        />
      </points>
      <lineSegments geometry={linesGeom}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={lineOpacity}
          depthWrite={false}
          blending={blending}
        />
      </lineSegments>
    </group>
  );
}
