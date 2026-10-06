"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

/**
 * The Lab's secondary scene: a field of points read as a data surface.
 * Slow waves carry the "signal", the pointer lifts a soft peak where it
 * passes, and higher points warm from grey to gold. One draw call.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  uniform float uPeak;
  varying float vHeight;
  varying float vDepth;
  void main() {
    vec3 p = position;
    float wave = sin(p.x * 0.55 + uTime * 0.6) * 0.22
               + sin(p.z * 0.9 - uTime * 0.45) * 0.16
               + sin((p.x + p.z) * 0.32 + uTime * 0.3) * 0.2;
    float d = distance(p.xz, uMouse);
    float peak = exp(-d * d * 0.35) * uPeak;
    p.y += wave + peak;
    vHeight = clamp((wave + peak + 0.4) / 2.0, 0.0, 1.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_PointSize = (2.2 + vHeight * 2.6) * uPixelRatio * (9.0 / vDepth);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uHigh;
  varying float vHeight;
  varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float fade = smoothstep(22.0, 6.0, vDepth);
    vec3 col = mix(uLow, uHigh, smoothstep(0.45, 0.95, vHeight));
    gl_FragColor = vec4(col, smoothstep(0.5, 0.15, d) * (0.25 + vHeight * 0.75) * fade);
  }
`;

function Field({
  pointer,
  reduced,
  light,
}: {
  pointer: MutableRefObject<{ x: number; y: number; inside: boolean }>;
  reduced: boolean;
  light: boolean;
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const smooth = useRef({ x: 0, z: 0, peak: 0 });

  const geometry = useMemo(() => {
    const cols = light ? 70 : 120;
    const rows = light ? 34 : 56;
    const width = 24;
    const depth = 14;
    const pos = new Float32Array(cols * rows * 3);
    let k = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pos[k++] = (c / (cols - 1) - 0.5) * width;
        pos[k++] = 0;
        pos[k++] = (r / (rows - 1) - 0.5) * depth;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [light]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 2 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPeak: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uLow: { value: new THREE.Color("#9C9C9C") },
      uHigh: { value: new THREE.Color("#C6A15B") },
    }),
    [gl],
  );

  useFrame((_, delta) => {
    const m = material.current;
    if (!m) return;
    const dt = Math.min(delta, 1 / 20);
    if (!reduced) m.uniforms.uTime.value += dt;
    const s = smooth.current;
    const k = 1 - Math.pow(0.004, dt);
    s.x += (pointer.current.x * 11 - s.x) * k;
    s.z += (-pointer.current.y * 6 - s.z) * k;
    s.peak += ((pointer.current.inside && !reduced ? 1.6 : 0.5) - s.peak) * k;
    m.uniforms.uMouse.value.set(s.x, s.z);
    m.uniforms.uPeak.value = s.peak;
  });

  return (
    <points geometry={geometry} rotation={[0, 0, 0]}>
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function FieldScene({
  pointer,
  active,
  reduced,
  light,
}: {
  pointer: MutableRefObject<{ x: number; y: number; inside: boolean }>;
  active: boolean;
  reduced: boolean;
  light: boolean;
}) {
  return (
    <Canvas
      dpr={light ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 4.2, 11] }}
      onCreated={({ camera }) => camera.lookAt(0, -0.6, 0)}
      gl={{ antialias: false, alpha: true }}
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      aria-hidden
    >
      <Field pointer={pointer} reduced={reduced} light={light} />
    </Canvas>
  );
}
