"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

import landPoints from "@/data/globe-points.json";
import { cities } from "@/data/site";

/**
 * The hero's "digital command center": a globe drawn only with land dots,
 * a dark core with a Congo-green rim, gold arcs leaving Kinshasa for the
 * cities the work runs through, and a light dust field for depth.
 *
 * Everything is custom shaders on points and lines — no textures, no lights,
 * no post-processing — so the whole scene costs a handful of draw calls.
 */

const R = 1.6;
const GOLD = new THREE.Color("#C6A15B");
const PAPER = new THREE.Color("#F4F1EA");
const CONGO = new THREE.Color("#1F6B4E");
const NIGHT = new THREE.Color("#07111F");

// Rotation that brings central Africa to the camera and tilts Europe into view.
const BASE_YAW = THREE.MathUtils.degToRad(-105);
const BASE_TILT = THREE.MathUtils.degToRad(20);

function toVector(lat: number, lon: number, radius = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export type SceneShared = {
  pointer: MutableRefObject<{ x: number; y: number }>;
  labels: MutableRefObject<(HTMLElement | null)[]>;
  reduced: boolean;
  light: boolean;
};

/* ------------------------------------------------------------------ land */

const landVertex = /* glsl */ `
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRand;
  varying float vFacing;
  varying float vRand;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normalize(position));
    vFacing = dot(n, normalize(-mv.xyz));
    vRand = aRand;
    gl_PointSize = uSize * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const landFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uWarm;
  uniform float uTime;
  varying float vFacing;
  varying float vRand;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float disc = smoothstep(0.5, 0.1, d);
    float face = smoothstep(-0.05, 0.75, vFacing);
    float twinkle = 0.78 + 0.22 * sin(uTime * 1.1 + vRand * 60.0);
    vec3 col = mix(uColor, uWarm, step(0.94, vRand) * 0.85);
    gl_FragColor = vec4(col, disc * mix(0.0, 0.92, face) * twinkle);
  }
`;

function Land({ light }: { light: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const data = landPoints as number[];
    const step = light ? 2 : 1;
    const positions: number[] = [];
    const rands: number[] = [];
    for (let i = 0; i < data.length; i += 2 * step) {
      const v = toVector(data[i] / 10, data[i + 1] / 10);
      positions.push(v.x, v.y, v.z);
      rands.push(Math.random());
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("aRand", new THREE.Float32BufferAttribute(rands, 1));
    return g;
  }, [light]);

  const uniforms = useMemo(
    () => ({
      uSize: { value: light ? 30 : 22 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColor: { value: PAPER.clone().multiplyScalar(0.92) },
      uWarm: { value: GOLD },
      uTime: { value: 0 },
    }),
    [gl, light],
  );

  useFrame((_, delta) => {
    if (material.current) material.current.uniforms.uTime.value += delta;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={landVertex}
        fragmentShader={landFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ core */

const fresnelVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const coreFragment = /* glsl */ `
  uniform vec3 uNight;
  uniform vec3 uCongo;
  uniform vec3 uGold;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = 1.0 - max(dot(vNormal, vView), 0.0);
    vec3 col = uNight * 0.9;
    col = mix(col, uCongo * 0.55, pow(f, 2.6));
    col += uGold * pow(f, 7.0) * 0.35;
    gl_FragColor = vec4(col, 1.0);
  }
`;
const haloFragment = /* glsl */ `
  uniform vec3 uCongo;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    // A thin rim of light at the limb that fades to nothing toward the
    // centre — an atmosphere, not a coloured disc.
    float f = 1.0 - max(dot(vNormal, vView), 0.0);
    float i = pow(f, 5.0) * smoothstep(1.0, 0.92, f);
    gl_FragColor = vec4(uCongo * 1.4, i * 0.9);
  }
`;

function Core() {
  const uniforms = useMemo(
    () => ({ uNight: { value: NIGHT }, uCongo: { value: CONGO }, uGold: { value: GOLD } }),
    [],
  );
  return (
    <>
      <mesh>
        <sphereGeometry args={[R * 0.985, 64, 64]} />
        <shaderMaterial vertexShader={fresnelVertex} fragmentShader={coreFragment} uniforms={uniforms} />
      </mesh>
      <mesh scale={1.06}>
        <sphereGeometry args={[R, 48, 48]} />
        <shaderMaterial
          vertexShader={fresnelVertex}
          fragmentShader={haloFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ arcs */

const arcVertex = /* glsl */ `
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const arcFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOffset;
  uniform float uSpeed;
  varying float vT;
  void main() {
    float head = fract(uTime * uSpeed + uOffset) * 1.4 - 0.2;
    float dist = head - vT;
    float tail = dist > 0.0 ? pow(max(0.0, 1.0 - dist / 0.28), 2.0) : 0.0;
    float ends = smoothstep(0.0, 0.04, vT) * smoothstep(1.0, 0.96, vT);
    gl_FragColor = vec4(uColor, (0.26 + tail * 1.0) * ends);
  }
`;

function Arc({ to, offset, reduced }: { to: THREE.Vector3; offset: number; reduced: boolean }) {
  const line = useMemo(() => {
    const from = toVector(cities[0].lat, cities[0].lon);
    const lift = 1 + from.distanceTo(to) * 0.22;
    const mid = from.clone().add(to).normalize().multiplyScalar(R * lift);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const pts = curve.getPoints(96);
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setAttribute("aT", new THREE.Float32BufferAttribute(pts.map((_, i) => i / (pts.length - 1)), 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: arcVertex,
      fragmentShader: arcFragment,
      uniforms: {
        uColor: { value: GOLD },
        uTime: { value: reduced ? 0.5 : 0 },
        uOffset: { value: offset },
        uSpeed: { value: 0.16 + offset * 0.05 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(g, m);
  }, [to, offset, reduced]);

  useFrame((_, delta) => {
    if (!reduced) (line.material as THREE.ShaderMaterial).uniforms.uTime.value += delta;
  });

  return <primitive object={line} />;
}

/* --------------------------------------------------------------- markers */

const markerVertex = /* glsl */ `
  uniform float uPixelRatio;
  attribute float aSize;
  attribute float aPhase;
  varying float vPhase;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normalize(position));
    vFacing = dot(n, normalize(-mv.xyz));
    vPhase = aPhase;
    gl_PointSize = aSize * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const markerFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying float vPhase;
  varying float vFacing;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float core = smoothstep(0.22, 0.08, d);
    float t = fract(uTime * 0.45 + vPhase);
    float ring = smoothstep(0.06, 0.0, abs(d - t)) * (1.0 - t);
    float a = (core + ring * 0.8) * smoothstep(0.0, 0.3, vFacing);
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

function Markers({ reduced }: { reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos: number[] = [];
    const size: number[] = [];
    const phase: number[] = [];
    cities.forEach((c, i) => {
      const v = toVector(c.lat, c.lon, R * 1.004);
      pos.push(v.x, v.y, v.z);
      size.push("hub" in c ? 260 : 170);
      phase.push(i * 0.17);
    });
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
    g.setAttribute("aPhase", new THREE.Float32BufferAttribute(phase, 1));
    return g;
  }, []);
  const uniforms = useMemo(
    () => ({
      uColor: { value: GOLD },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    }),
    [gl],
  );
  useFrame((_, delta) => {
    if (material.current && !reduced) material.current.uniforms.uTime.value += delta;
  });
  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={markerVertex}
        fragmentShader={markerFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ dust */

const dustVertex = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uTime;
  attribute float aRand;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.12 + aRand * 20.0) * 0.08;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    // Far particles shrink and fade, near ones soften: a cheap depth of field.
    vAlpha = smoothstep(14.0, 4.0, depth) * (0.25 + aRand * 0.55);
    gl_PointSize = (6.0 + aRand * 10.0) * uPixelRatio / depth;
    gl_Position = projectionMatrix * mv;
  }
`;
const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

function Dust({ count, reduced }: { count: number; reduced: boolean }) {
  const group = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 2.4 + Math.random() * 6.5;
      const v = new THREE.Vector3().randomDirection().multiplyScalar(r);
      pos.set([v.x * 1.6, v.y, v.z], i * 3);
      rand[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return g;
  }, [count]);
  const uniforms = useMemo(
    () => ({
      uColor: { value: PAPER },
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    }),
    [gl],
  );
  useFrame((_, delta) => {
    if (reduced) return;
    if (material.current) material.current.uniforms.uTime.value += delta;
    if (group.current) group.current.rotation.y += delta * 0.012;
  });
  return (
    <points ref={group} geometry={geometry}>
      <shaderMaterial
        ref={material}
        vertexShader={dustVertex}
        fragmentShader={dustFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------- the rig */

const tmp = new THREE.Vector3();
const normal = new THREE.Vector3();
const toCamera = new THREE.Vector3();

function Rig({ pointer, labels, reduced, light }: SceneShared) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const cityVectors = useMemo(() => cities.map((c) => toVector(c.lat, c.lon, R * 1.02)), []);
  const arcTargets = useMemo(() => cities.slice(1).map((c) => toVector(c.lat, c.lon)), []);
  const smooth = useRef({ x: 0, y: 0, scroll: 0 });
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (!tilt.current || !spin.current) return;
    const dt = Math.min(delta, 1 / 20);
    if (!reduced) clock.current += dt;

    const narrow = size.width < size.height * 0.95;
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const s = smooth.current;
    const k = 1 - Math.pow(0.0025, dt);
    s.x += ((reduced ? 0 : pointer.current.x) - s.x) * k;
    s.y += ((reduced ? 0 : pointer.current.y) - s.y) * k;
    s.scroll += (scroll - s.scroll) * k;

    // Camera: drifts with the pointer, dollies in toward Kinshasa on scroll.
    const baseZ = narrow ? 8.6 : 8.2;
    camera.position.set(s.x * 0.35, s.y * 0.22 - s.scroll * 0.6, baseZ - s.scroll * 1.9);
    camera.lookAt(0, narrow ? 0.2 : -s.scroll * 0.5, 0);

    // Globe: slow oscillation around Africa rather than a full spin, so the
    // arcs stay readable; scroll turns it a little further toward Kinshasa.
    tilt.current.position.set(narrow ? 0 : 1.9 - s.scroll * 0.9, narrow ? 1.15 : 0.3, 0);
    tilt.current.scale.setScalar(narrow ? Math.min(0.9, (size.width / size.height) * 1.45) : 1);
    tilt.current.rotation.x = BASE_TILT - s.scroll * 0.3 + s.y * 0.08;
    spin.current.rotation.y = BASE_YAW + Math.sin(clock.current * 0.11) * 0.38 + s.x * 0.18 + s.scroll * 0.25;

    // DOM labels follow their city and fade on the far side.
    spin.current.updateWorldMatrix(true, false);
    cityVectors.forEach((v, i) => {
      const el = labels.current[i];
      if (!el) return;
      tmp.copy(v).applyMatrix4(spin.current!.matrixWorld);
      normal.copy(tmp).sub(tilt.current!.position).normalize();
      toCamera.copy(camera.position).sub(tmp).normalize();
      const facing = normal.dot(toCamera);
      tmp.project(camera);
      const x = (tmp.x * 0.5 + 0.5) * size.width;
      const y = (-tmp.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = String(Math.max(0, Math.min(1, (facing - 0.15) * 3)) * (1 - s.scroll));
    });
  });

  return (
    <group ref={tilt}>
      <group ref={spin}>
        <Core />
        <Land light={light} />
        {arcTargets.map((to, i) => (
          <Arc key={i} to={to} offset={i * 0.21} reduced={reduced} />
        ))}
        <Markers reduced={reduced} />
      </group>
    </group>
  );
}

export default function GlobeScene({
  shared,
  active,
  onReady,
}: {
  shared: SceneShared;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Canvas
      dpr={shared.light ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: 34, near: 0.1, far: 40, position: [0, 0, 8.2] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? (shared.reduced ? "demand" : "always") : "never"}
      onCreated={() => onReady()}
      aria-hidden
    >
      <Rig {...shared} />
      <Dust count={shared.light ? 220 : 650} reduced={shared.reduced} />
    </Canvas>
  );
}
