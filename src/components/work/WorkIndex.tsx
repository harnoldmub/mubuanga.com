"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";
import { projectImage, type Project } from "@/data/projects";

/**
 * The index reads as a table and stays one until you touch it. The preview is
 * mounted only for the row under the pointer, so the page ships text — not
 * sixteen captures waiting for a hover that may never come.
 */
export default function WorkIndex({
  projects,
}: {
  projects: readonly Project[];
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ul
      className="border-t border-ink-line"
      onMouseLeave={() => setHovered(null)}
    >
      {projects.map((project, i) => (
        <Reveal
          as="li"
          key={project.slug}
          delay={Math.min(i, 6) * 0.04}
          className="group border-b border-ink-line"
        >
          {project.comingSoon ? (
            <div className="grid-12 items-center gap-y-4 py-7 lg:py-8">
              <h2 className="col-span-6 text-heading font-semibold text-paper/60 md:col-span-12 lg:col-span-5">
                {project.name}
              </h2>
              <p className="col-span-6 hidden text-sm text-paper/55 md:col-span-6 lg:col-span-5 lg:block">
                {project.tagline}
              </p>
              <span className="col-span-6 text-sm text-gold md:col-span-12 lg:col-span-2 lg:text-right">
                Bientôt en ligne
              </span>
            </div>
          ) : (
            <Link
              href={`/projets/${project.slug}`}
              onMouseEnter={() => setHovered(project.slug)}
              onFocus={() => setHovered(project.slug)}
              className="grid-12 items-center gap-y-4 py-7 lg:py-8"
            >
              <h2 className="col-span-6 text-heading font-semibold text-paper transition-transform duration-500 ease-expo md:col-span-12 lg:col-span-5 lg:group-hover:translate-x-2">
                {project.name}
              </h2>

              <p className="col-span-6 hidden text-sm text-paper/55 md:col-span-6 lg:col-span-3 lg:block">
                {project.tagline}
              </p>

              <span className="relative col-span-2 hidden h-16 overflow-hidden lg:block">
                {hovered === project.slug && (
                  <Image
                    src={projectImage(project.slug)}
                    alt=""
                    fill
                    sizes="180px"
                    className="object-cover object-top"
                  />
                )}
              </span>

              <span className="col-span-4 flex items-center justify-end gap-4 text-right md:col-span-12 lg:col-span-2">
                <span className="meta hidden whitespace-nowrap xl:inline">
                  {project.category}
                </span>
                <span className="meta tabular-nums">{project.year}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-paper/50 transition-colors duration-300 group-hover:text-paper" />
              </span>
            </Link>
          )}
        </Reveal>
      ))}
    </ul>
  );
}
