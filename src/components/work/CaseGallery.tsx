"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

import Reveal from "@/components/ui/Reveal";
import { projectImage, projectSections, type Project } from "@/data/projects";

/** One framed capture: hairline ring, raised plate while it loads. */
function Shot({
  src,
  alt,
  width,
  height,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-ink-raised ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        sizes={sizes}
        className="h-auto w-full"
      />
      <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-line" />
    </div>
  );
}

function Caption({ index, total, label }: { index: number; total: number; label: string }) {
  return (
    <figcaption className="mt-3 flex items-baseline justify-between gap-4">
      <span className="meta">{label}</span>
      <span className="meta tabular-nums">
        {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </figcaption>
  );
}

/**
 * Desktop capture and phone capture composed together rather than stacked:
 * the phone overlaps the desktop frame and drifts against the scroll, so the
 * gallery reads as one object instead of two screenshots. Below it, the
 * sections further down the page, laid out as an editorial sequence.
 */
export default function CaseGallery({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["9%", "-9%"]);

  const { desktop, mobile } = projectSections(project.slug);
  const total = desktop.length + mobile.length;
  let n = 0;
  const next = () => ++n;

  const [wide, ...rest] = desktop;
  const pair = rest.slice(0, 2);
  const tail = rest.slice(2);

  return (
    <section ref={ref} className="shell relative py-section" aria-label={`Captures de ${project.name}`}>
      <p className="meta">Captures</p>

      <div className="grid-12 mt-8 items-center">
        <div className="col-span-6 md:col-span-12 lg:col-span-9">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-raised">
            <Image
              src={projectImage(project.slug)}
              alt={`${project.name} — vue desktop`}
              fill
              loading="lazy"
              sizes="(max-width: 1023px) 100vw, 72vw"
              className="object-cover object-top"
            />
            <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-line" />
          </div>
        </div>

        <motion.div
          style={{ y: phoneY }}
          className="col-span-4 col-start-2 -mt-16 md:col-span-4 md:col-start-8 lg:col-span-3 lg:col-start-9 lg:mt-0"
        >
          <div className="relative aspect-[390/799] w-full overflow-hidden bg-ink-raised shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]">
            <Image
              src={projectImage(project.slug, "mobile")}
              alt={`${project.name} — vue mobile`}
              fill
              loading="lazy"
              sizes="(max-width: 1023px) 40vw, 24vw"
              className="object-cover object-top"
            />
            <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ink-line" />
          </div>
        </motion.div>
      </div>

      {total > 0 && (
        <div className="mt-section">
          <div className="flex items-baseline justify-between border-t border-ink-line pt-6">
            <p className="meta">Au fil de la page</p>
            <p className="meta tabular-nums">{total} vues</p>
          </div>

          <div className="mt-10 space-y-12 lg:space-y-20">
            {wide && (
              <Reveal as="figure">
                <Shot
                  src={wide}
                  alt={`${project.name} — section de la page d'accueil`}
                  width={1440}
                  height={900}
                  sizes="(max-width: 1279px) 100vw, 1200px"
                />
                <Caption index={next()} total={total} label="Desktop" />
              </Reveal>
            )}

            {pair.length > 0 && (
              <div className="grid-12 gap-y-12">
                {pair.map((src, i) => (
                  <Reveal
                    key={src}
                    as="figure"
                    delay={i * 0.08}
                    className={`col-span-6 ${pair.length === 1 ? "md:col-span-12" : "md:col-span-6"} ${i === 1 ? "md:mt-24" : ""}`}
                  >
                    <Shot
                      src={src}
                      alt={`${project.name} — section de la page d'accueil`}
                      width={1440}
                      height={900}
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                    <Caption index={next()} total={total} label="Desktop" />
                  </Reveal>
                ))}
              </div>
            )}

            {mobile.length > 0 && (
              <div className="grid-12 gap-y-12 bg-ink-raised py-12 lg:py-20">
                {mobile.map((src, i) => (
                  <Reveal
                    key={src}
                    as="figure"
                    delay={i * 0.08}
                    className={`col-span-3 md:col-span-4 lg:col-span-3 ${
                      i === 0 ? "md:col-start-3 lg:col-start-4" : "md:col-start-7 lg:col-start-7 md:mt-16"
                    }`}
                  >
                    <Shot
                      src={src}
                      alt={`${project.name} — section en version mobile`}
                      width={390}
                      height={799}
                      sizes="(max-width: 767px) 45vw, 25vw"
                      className="shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
                    />
                    <Caption index={next()} total={total} label="Mobile" />
                  </Reveal>
                ))}
              </div>
            )}

            {tail.map((src) => (
              <Reveal key={src} as="figure" className="lg:px-[8%]">
                <Shot
                  src={src}
                  alt={`${project.name} — section de la page d'accueil`}
                  width={1440}
                  height={900}
                  sizes="(max-width: 1279px) 100vw, 1000px"
                />
                <Caption index={next()} total={total} label="Desktop" />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
