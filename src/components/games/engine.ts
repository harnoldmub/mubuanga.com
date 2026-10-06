"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** The site's palette, so the games are drawn in the same ink as the pages. */
export const PALETTE = {
  ink: "#050505",
  raised: "#0B0B0C",
  paper: "#F2F0EA",
  grey: "#8B8B8B",
  blue: "#C6A15B",
  line: "rgba(242,240,234,0.10)",
} as const;

export type GameStatus = "idle" | "playing" | "over";

/**
 * A fixed-timestep loop on requestAnimationFrame. Both games advance in whole
 * steps so they behave identically at 60Hz and 120Hz, and neither runs while
 * the tab is hidden.
 */
export function useGameLoop(step: (frame: number) => void, running: boolean) {
  const saved = useRef(step);
  saved.current = step;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const TICK = 1000 / 60;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      acc += Math.min(now - last, 250); // a long pause must not fast-forward
      last = now;
      let n = 0;
      while (acc >= TICK && n < 5) {
        saved.current(n);
        acc -= TICK;
        n += 1;
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [running]);
}

/**
 * Sizes a canvas to its container at device resolution and re-sizes with it.
 * Returns the logical (CSS pixel) dimensions the games draw against.
 */
export function useCanvasSize(
  canvas: React.RefObject<HTMLCanvasElement>,
  aspect: number,
) {
  const [size, setSize] = useState({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const el = canvas.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const apply = () => {
      const width = host.clientWidth;
      if (!width) return;
      const height = Math.round(width / aspect);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(width * dpr);
      el.height = Math.round(height * dpr);
      el.style.width = `${width}px`;
      el.style.height = `${height}px`;
      setSize({ width, height, dpr });
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(host);
    return () => ro.disconnect();
  }, [canvas, aspect]);

  return size;
}

/** Best score per game, kept only on this device. */
export function useBestScore(key: string) {
  const [best, setBest] = useState(0);
  const storageKey = `amy:best:${key}`;

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) setBest(Number(raw) || 0);
  }, [storageKey]);

  const submit = useCallback(
    (score: number) => {
      setBest((current) => {
        if (score <= current) return current;
        try {
          localStorage.setItem(storageKey, String(score));
        } catch {
          /* private mode — the score just does not persist */
        }
        return score;
      });
    },
    [storageKey],
  );

  return [best, submit] as const;
}

/**
 * Three short blips built from an oscillator — no audio files, and silent
 * unless the visitor turns it on. The preference is remembered, off by default.
 */
export function useSound() {
  const [on, setOn] = useState(false);
  const ctx = useRef<AudioContext | null>(null);

  useEffect(() => {
    setOn(localStorage.getItem("amy:sound") === "on");
  }, []);

  const toggle = useCallback(() => {
    setOn((v) => {
      const next = !v;
      try {
        localStorage.setItem("amy:sound", next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const play = useCallback(
    (kind: "point" | "hit" | "over") => {
      if (!on) return;
      try {
        ctx.current ??= new AudioContext();
        const ac = ctx.current;
        if (ac.state === "suspended") void ac.resume();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        const t = ac.currentTime;
        const spec = {
          point: { f: 880, to: 1320, d: 0.07, v: 0.05 },
          hit: { f: 320, to: 260, d: 0.05, v: 0.04 },
          over: { f: 220, to: 90, d: 0.34, v: 0.06 },
        }[kind];
        osc.type = "square";
        osc.frequency.setValueAtTime(spec.f, t);
        osc.frequency.exponentialRampToValueAtTime(spec.to, t + spec.d);
        gain.gain.setValueAtTime(spec.v, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + spec.d);
        osc.connect(gain).connect(ac.destination);
        osc.start(t);
        osc.stop(t + spec.d + 0.02);
      } catch {
        /* audio unavailable — the games are silent, which is the default anyway */
      }
    },
    [on],
  );

  useEffect(() => () => void ctx.current?.close(), []);

  return { on, toggle, play };
}

/** Swipes, for the games that are steered rather than dragged. */
export function useSwipe(
  target: React.RefObject<HTMLElement>,
  onSwipe: (dir: "up" | "down" | "left" | "right") => void,
) {
  const saved = useRef(onSwipe);
  saved.current = onSwipe;

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let x = 0;
    let y = 0;

    const start = (e: TouchEvent) => {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    };
    const end = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - x;
      const dy = e.changedTouches[0].clientY - y;
      if (Math.hypot(dx, dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) saved.current(dx > 0 ? "right" : "left");
      else saved.current(dy > 0 ? "down" : "up");
    };
    // The page must not scroll under a game in progress.
    const block = (e: TouchEvent) => e.preventDefault();

    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchmove", block, { passive: false });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchmove", block);
      el.removeEventListener("touchend", end);
    };
  }, [target]);
}

/**
 * Occasional commentary. Shown once per threshold, never twice in a run, and
 * never often enough to become noise.
 */
const TAUNTS: readonly (readonly [number, string])[] = [
  [5, "NOT BAD."],
  [10, "OK, TU SAIS JOUER."],
  [18, "STILL HERE?"],
  [28, "SHIP IT."],
  [40, "TOUCH SOME GRASS."],
  [60, "BON, IL FAUT TRAVAILLER."],
];

export function useTaunt(score: number, status: GameStatus) {
  const [taunt, setTaunt] = useState<string | null>(null);
  const fired = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (status !== "playing") return;
    const hit = TAUNTS.find(([at]) => score >= at && !fired.current.has(at));
    if (!hit) return;
    fired.current.add(hit[0]);
    setTaunt(hit[1]);
    const timer = setTimeout(() => setTaunt(null), 2200);
    return () => clearTimeout(timer);
  }, [score, status]);

  useEffect(() => {
    if (status === "idle") fired.current.clear();
  }, [status]);

  return taunt;
}
