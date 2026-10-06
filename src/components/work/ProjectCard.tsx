"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import Reveal from "@/components/ui/Reveal";
import { projectImage, type Project } from "@/data/projects";
import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

/**
 * A project as it appears in a grid: the capture uncovers on scroll and
 * drifts slightly inside its frame, the whole card is one link.
 */
export default function ProjectCard({
  project,
  className,
  priority = false,
}: {
  project: Project;
  className?: string;
  priority?: boolean;
}) {
  const frame = useRef<HTMLDivElement>(null);
  // Observed on the card, not on the clipped frame: a target fully hidden by
  // its own clip-path never reports as intersecting.
  const card = useReveal<HTMLElement>({ amount: 0.15 });
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-4%", "4%"]);

  return (
    <article ref={card} className={cn("group", className)}>
      <Link href={`/projets/${project.slug}`} className="block">
        <div className="reveal-clip">
          <div ref={frame} className="relative aspect-[16/10] overflow-hidden rounded-sm bg-ink-raised">
            <motion.div style={{ y }} className="absolute -inset-y-[5%] inset-x-0">
              <Image
                src={projectImage(project.slug)}
                alt={`Page d'accueil du site ${project.name}`}
                fill
                priority={priority}
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover object-top transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.03]"
              />
            </motion.div>
            <span className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-ink-line" />
          </div>
        </div>

        <Reveal className="mt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-heading font-semibold text-paper">{project.name}</h3>
            <span className="shrink-0 text-sm text-grey">{project.category}</span>
          </div>
          <p className="mt-2 max-w-[34rem] text-paper/70">{project.tagline}</p>
          <span className="mt-4 inline-block text-sm text-gold">
            <span className="link-underline group-hover:bg-[length:100%_1px]">Voir le projet</span>
          </span>
        </Reveal>
      </Link>
    </article>
  );
}
