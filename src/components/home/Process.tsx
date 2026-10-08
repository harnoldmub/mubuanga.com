"use client";

import { useEffect, useRef } from "react";

import RevealLines from "@/components/ui/RevealLines";
import { process } from "@/data/site";

/**
 * Five steps. On large screens the section pins and the steps travel
 * sideways while a gold rule fills — the one scroll-driven sequence of the
 * page. Elsewhere (touch, narrow, reduced motion) it is a plain vertical
 * timeline, readable with no JavaScript at all.
 */
export default function Process() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !root.current || !track.current) return;
      gsap.registerPlugin(ScrollTrigger);

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)",
        () => {
          const distance = () =>
            track.current!.scrollWidth - track.current!.clientWidth;
          const tween = gsap.to(track.current, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance() + window.innerHeight * 0.35}`,
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });
          gsap.fromTo(
            fill.current,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: () => `+=${distance() + window.innerHeight * 0.35}`,
                scrub: 0.6,
              },
            },
          );
          return () => tween.kill();
        },
      );
      ctx = mm;
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  // GSAP's pin wraps the section in a "pin-spacer" it creates itself. That
  // moves the section out from under its React parent, and on navigation
  // React's removeChild then throws ("Application error"). The wrapper div
  // stays React's own child, so unmounting removes it cleanly.
  return (
    <div>
      <section
        ref={root}
        className="process relative overflow-hidden border-y border-ink-line bg-night lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center"
        aria-labelledby="process-title"
      >
        <div className="shell py-section lg:py-16">
          <div className="section-head">
            <h2
              id="process-title"
              className="text-title font-semibold text-paper"
            >
              <RevealLines lines={["Comment je travaille"]} />
            </h2>
            <p className="text-paper/70">
              Cinq étapes, chacune avec un livrable que vous pouvez voir et
              valider avant de passer à la suivante.
            </p>
          </div>

          <div
            className="relative mt-14 hidden h-px bg-ink-line lg:block"
            aria-hidden
          >
            <span
              ref={fill}
              className="absolute inset-0 origin-left scale-x-0 bg-gold"
            />
          </div>

          <ol
            ref={track}
            className="process-track relative mt-10 grid gap-10 border-l border-ink-line pl-6 lg:mt-12 lg:flex lg:gap-0 lg:border-l-0 lg:pl-0"
          >
            {process.map((step, i) => (
              <li
                key={step.title}
                className="relative lg:w-[34vw] lg:max-w-[30rem] lg:shrink-0 lg:pr-[4vw]"
              >
                <span
                  aria-hidden
                  className="absolute -left-[1.6rem] top-2 h-2 w-2 rounded-full bg-gold lg:hidden"
                />
                <p className="text-sm tabular-nums text-gold">
                  Étape {i + 1} sur {process.length}
                </p>
                <h3 className="mt-3 text-[clamp(2rem,3.4vw,3.25rem)] font-semibold leading-none tracking-[-0.035em] text-paper">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-[26rem] text-paper/70">{step.body}</p>
                <p className="mt-6 text-sm text-grey">
                  Livrable : <span className="text-paper">{step.output}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
