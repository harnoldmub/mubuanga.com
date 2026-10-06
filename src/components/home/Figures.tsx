"use client";

import { useEffect, useRef, useState } from "react";

import { figures } from "@/data/site";

/** Counts the leading number up once, when the row enters the viewport. */
function Value({ value, run }: { value: string; run: boolean }) {
  const match = value.match(/^([\d\s ]+)(.*)$/);
  const target = match ? Number(match[1].replace(/\s| /g, "")) : NaN;
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!run || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const suffix = match?.[2] ?? "";
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      const eased = 1 - Math.pow(1 - t, 4);
      setShown(`${Math.round(target * eased).toLocaleString("fr-FR")}${suffix}`);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setShown(value);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  return (
    <>
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}

export default function Figures() {
  const ref = useRef<HTMLElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="shell pb-section" aria-label="En chiffres">
      <dl className="grid border-t border-ink-line sm:grid-cols-2 lg:grid-cols-4">
        {figures.map((figure) => (
          <div key={figure.label} className="border-b border-ink-line py-8 sm:pr-8 lg:border-b-0 lg:py-10">
            <dt className="sr-only">{figure.label}</dt>
            <dd className="text-[clamp(2.6rem,4.6vw,4.25rem)] font-semibold leading-none tracking-[-0.045em] tabular-nums text-paper">
              <Value value={figure.value} run={run} />
            </dd>
            <dd className="mt-4 max-w-[17rem] text-paper/65">{figure.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
