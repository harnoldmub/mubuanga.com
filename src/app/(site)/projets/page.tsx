import type { Metadata } from "next";

import ProjectsBrowser from "@/components/work/ProjectsBrowser";
import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import { projects, publishedProjects } from "@/data/projects";
import { buildMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projets",
  description:
    "Plateformes, sites premium, outils institutionnels et expériences événementielles conçus et développés par Arnold Mubuanga, en France, en Belgique et en RDC.",
  path: "/projets",
});

const listJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Projets",
  url: `${siteUrl}/projets`,
  hasPart: publishedProjects.map((project) => ({
    "@type": "CreativeWork",
    name: project.name,
    url: `${siteUrl}/projets/${project.slug}`,
    dateCreated: project.year,
    genre: project.category,
  })),
};

export default function ProjectsPage() {
  return (
    <>
      <JsonLd data={listJsonLd} />

      <section className="pb-12 pt-[calc(var(--header-h)+clamp(3.5rem,8vw,7rem))]">
        <div className="shell">
          <h1 className="text-display font-semibold text-paper">
            <RevealLines lines={["Projets"]} immediate delay={0.1} />
          </h1>
          <div className="section-head mt-6">
            <Reveal immediate delay={0.25}>
              <p className="max-w-[40rem] text-lead text-paper/70">
                Des applications utilisées par des administrations, des plateformes que j&apos;ai
                lancées moi-même, des sites premium pour des marques et des institutions. Chaque
                projet est présenté avec son contexte et ce que j&apos;y ai fait.
              </p>
            </Reveal>
            <Reveal immediate delay={0.35}>
              <p className="text-paper/60 lg:text-right">
                {projects.length} projets, de 2018 à aujourd&apos;hui
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <ProjectsBrowser projects={projects} />
    </>
  );
}
