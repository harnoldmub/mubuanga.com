"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Shown once per session only. Counts 000 → 100 in a fixed ~0.9s, then lifts.
 * It never waits on the network: a slow asset must not hold the page hostage.
 */
export default function Loader() {
  const reduced = useReducedMotion();
  const [done, setDone] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("amy:seen") === "1") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sessionStorage.setItem("amy:seen", "1");
      return;
    }
    setDone(false);
    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    const DURATION = 900;
    // requestAnimationFrame is suspended in a background tab. A timer is not,
    // so it guarantees the overlay lifts even if the page opened unfocused.
    const failsafe = window.setTimeout(() => {
      sessionStorage.setItem("amy:seen", "1");
      setCount(100);
      setDone(true);
    }, DURATION + 1200);

    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / DURATION);
      // ease-out so the counter decelerates into 100 rather than snapping
      setCount(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem("amy:seen", "1");
        setTimeout(() => setDone(true), 180);
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col justify-end bg-ink px-gutter pb-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: EASE }}
          aria-hidden
        >
          <div className="flex items-end justify-between gap-6">
            <p className="overflow-hidden text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-paper">
              <motion.span
                className="block"
                initial={{ y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                Arnold Mubuanga
              </motion.span>
            </p>
            <span className="pb-1 text-sm tabular-nums text-grey">{String(count).padStart(3, "0")}</span>
          </div>
          <div className="mt-5 h-px w-full bg-ink-line">
            <div className="h-px origin-left bg-gold" style={{ transform: `scaleX(${count / 100})` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
