import Link from "next/link";

import ProjectCard from "@/components/work/ProjectCard";
import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import { featuredProjects, projects } from "@/data/projects";

// Alternating widths so the grid reads as an edit, not a catalogue.
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"] as const;

export default function SelectedWork() {
  return (
    <section className="shell py-section" aria-labelledby="work-title">
      <div className="section-head">
        <h2 id="work-title" className="text-title font-semibold text-paper">
          <RevealLines lines={["Projets récents"]} />
        </h2>
        <Reveal>
          <p className="text-paper/70">
            Les huit derniers projets livrés : plateformes, sites premium, institutions et
            événements, entre la France, la Belgique et la RDC.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-12 lg:gap-y-24">
        {featuredProjects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            priority={i < 2}
            className={`${SPANS[i % 4]} ${i % 2 === 1 ? "lg:mt-28" : ""}`}
          />
        ))}
      </div>

      <Reveal className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-ink-line pt-8">
        <p className="text-paper/70">{projects.length} projets au total, de 2018 à aujourd&apos;hui.</p>
        <Link href="/projets" className="btn btn-ghost">
          Voir tous les projets
        </Link>
      </Reveal>
    </section>
  );
}
