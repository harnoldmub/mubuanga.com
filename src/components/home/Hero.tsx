"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import Magnetic from "@/components/ui/Magnetic";
import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import type { SceneShared } from "@/components/three/GlobeScene";
import { cities } from "@/data/site";
import { profile } from "@/data/profile";

const GlobeScene = dynamic(() => import("@/components/three/GlobeScene"), { ssr: false });

const CLOCKS = [
  { city: "Kinshasa", zone: "Africa/Kinshasa" },
  { city: "Bruxelles", zone: "Europe/Brussels" },
  { city: "Lille", zone: "Europe/Paris" },
] as const;

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

function webglAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type Mode = "pending" | "scene" | "poster";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const labels = useRef<(HTMLElement | null)[]>([]);
  const [mode, setMode] = useState<Mode>("pending");
  const [shared, setShared] = useState<SceneShared | null>(null);
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const now = useClock();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const light =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!webglAvailable() || conn?.saveData) {
      setMode("poster");
      return;
    }
    setShared({ pointer, labels, reduced, light });
    setMode("scene");
  }, []);

  // Pointer → normalised [-1, 1], read by the scene every frame.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Stop rendering once the hero has left the screen.
  useEffect(() => {
    if (!section.current) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "0px 0px 0px 0px",
    });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={section}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
      aria-labelledby="hero-title"
    >
      {/* depth: a night-blue floor under the globe */}
      <div aria-hidden className="hero-floor absolute inset-0 -z-10" />

      <div aria-hidden className="absolute inset-0 -z-10">
        {(mode === "poster" || (mode === "scene" && !ready)) && (
          <>
            <Image
              src="/assets/hero/globe-poster.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="hidden object-cover object-right lg:block"
            />
            <Image
              src="/assets/hero/globe-poster-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-top lg:hidden"
            />
          </>
        )}
        {mode === "scene" && shared && (
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
            <GlobeScene shared={shared} active={active} onReady={() => setReady(true)} />
          </div>
        )}
        {mode === "scene" && (
          <div className="pointer-events-none absolute inset-0">
            {cities.map((city, i) => (
              <span
                key={city.name}
                ref={(el) => {
                  labels.current[i] = el;
                }}
                className="globe-label"
                style={{ opacity: 0 }}
              >
                <span className={`globe-label-text globe-label-${city.side}`}>{city.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* legibility on narrow screens, where the text sits over the globe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-3/4 bg-gradient-to-t from-ink via-ink/85 to-transparent lg:hidden"
      />

      <div className="shell relative mt-auto pb-10 pt-[calc(var(--header-h)+2rem)] lg:pb-14">
        <div className="max-w-[44rem]">
          <h1 id="hero-title" className="text-display font-semibold text-paper">
            <RevealLines lines={["Arnold Mubuanga"]} immediate delay={0.15} />
          </h1>
          <Reveal immediate delay={0.35}>
            <p className="mt-5 text-[clamp(1.2rem,2vw,1.6rem)] font-medium leading-snug tracking-[-0.02em] text-paper">
              Développeur, chef de projet et créateur de plateformes digitales.
            </p>
          </Reveal>
          <Reveal immediate delay={0.45}>
            <p className="mt-4 max-w-[36rem] text-paper/70">
              Je conçois des sites, applications, back-offices et expériences digitales pour des
              marques, institutions, événements et projets ambitieux.
            </p>
          </Reveal>
          <Reveal immediate delay={0.55}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link href="/projets" className="btn btn-primary">
                  Voir les projets
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/contact" className="btn btn-ghost">
                  Me contacter
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <Reveal immediate delay={0.7}>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-ink-line pt-5 text-sm sm:max-w-xl lg:absolute lg:bottom-14 lg:right-[var(--gutter)] lg:mt-0 lg:w-[26rem]">
            {CLOCKS.map((clock) => (
              <div key={clock.city}>
                <dt className="text-grey">{clock.city}</dt>
                <dd className="mt-1 tabular-nums text-paper" suppressHydrationWarning>
                  {now
                    ? new Intl.DateTimeFormat("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: clock.zone,
                      }).format(now)
                    : "--:--"}
                </dd>
              </div>
            ))}
            <p className="col-span-3 mt-2 flex items-center gap-2 text-grey">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-congo shadow-[0_0_0_3px_rgba(31,107,78,0.25)]" />
              {profile.availability}
            </p>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
