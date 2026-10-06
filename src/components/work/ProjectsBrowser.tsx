"use client";

import { useMemo, useState } from "react";

import ProjectCard from "@/components/work/ProjectCard";
import WorkIndex from "@/components/work/WorkIndex";
import { projectGroup, projectGroups, type Project, type ProjectGroup } from "@/data/projects";
import { cn } from "@/lib/utils";

type View = "grille" | "liste";

/** Filters by family and toggles between a visual grid and a dense list. */
export default function ProjectsBrowser({ projects }: { projects: readonly Project[] }) {
  const [group, setGroup] = useState<ProjectGroup | "Tous">("Tous");
  const [view, setView] = useState<View>("grille");

  const visible = useMemo(
    () => (group === "Tous" ? projects : projects.filter((p) => projectGroup(p) === group)),
    [group, projects],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach((p) => map.set(projectGroup(p), (map.get(projectGroup(p)) ?? 0) + 1));
    return map;
  }, [projects]);

  return (
    <section className="shell pb-section" aria-label="Liste des projets">
      <div className="sticky top-[var(--header-h)] z-10 -mx-[var(--gutter)] flex flex-wrap items-center justify-between gap-4 border-y border-ink-line bg-ink/85 px-[var(--gutter)] py-3 backdrop-blur-xl">
        <div role="group" aria-label="Filtrer par type" className="flex flex-wrap gap-1">
          {(["Tous", ...projectGroups] as const).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={cn(
                "h-9 rounded-sm px-3 text-sm transition-colors duration-200",
                group === g ? "bg-paper text-ink" : "text-paper/70 hover:text-paper",
              )}
            >
              {g}
              <span className={cn("ml-1.5 tabular-nums", group === g ? "text-ink/60" : "text-grey")}>
                {g === "Tous" ? projects.length : counts.get(g) ?? 0}
              </span>
            </button>
          ))}
        </div>
        <div role="group" aria-label="Affichage" className="flex gap-1">
          {(["grille", "liste"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={cn(
                "h-9 rounded-sm px-3 text-sm capitalize transition-colors duration-200",
                view === v ? "text-paper" : "text-grey hover:text-paper",
              )}
            >
              {v === "grille" ? "Grille" : "Liste"}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} projets affichés
      </p>

      {view === "grille" ? (
        <div key={group} className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {visible.map((project, i) => (
            <ProjectCard key={project.slug} project={project} priority={i < 2} />
          ))}
        </div>
      ) : (
        <div key={group} className="mt-8">
          <WorkIndex projects={visible} />
        </div>
      )}
    </section>
  );
}
