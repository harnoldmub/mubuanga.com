import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import RevealLines from "@/components/ui/RevealLines";
import Reveal from "@/components/ui/Reveal";
import CaseGallery from "@/components/work/CaseGallery";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import {
  getProject,
  getProjectNeighbours,
  projectImage,
  projects,
} from "@/data/projects";
import { buildMetadata, JsonLd, siteUrl } from "@/lib/seo";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const project = getProject(params.slug);
  if (!project) return buildMetadata({ title: "Projet introuvable", noIndex: true });

  return buildMetadata({
    title: `${project.name} — ${project.category}`,
    description: `${project.tagline} ${project.summary}`.slice(0, 200),
    path: `/projets/${project.slug}`,
    type: "article",
  });
}

/** Section shell — every case study is built from these, in this order. */
function Chapter({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal as="section" className="grid-12 border-t border-ink-line py-10 lg:py-14">
      <p className="col-span-1 text-sm tabular-nums text-gold">{index}</p>
      <h2 className="col-span-5 font-display text-heading font-semibold text-paper md:col-span-11 lg:col-span-3">
        {title}
      </h2>
      <div className="col-span-6 mt-4 md:col-span-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
        {children}
      </div>
    </Reveal>
  );
}

export default function CaseStudyPage({ params }: Params) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const { previous, next } = getProjectNeighbours(project.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    headline: project.tagline,
    description: project.summary,
    url: `${siteUrl}/projets/${project.slug}`,
    dateCreated: project.year,
    genre: project.category,
    inLanguage: "fr-FR",
    image: `${siteUrl}${projectImage(project.slug)}`,
    creator: { "@id": `${siteUrl}/#person` },
    sameAs: project.url,
  };

  const facts = [
    { label: "Année", value: project.year },
    { label: "Type", value: project.category },
    { label: "Rôle", value: project.role },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ---------------- hero ---------------- */}
      <section className="relative pt-[calc(var(--header-h)+clamp(3rem,8vw,6rem))]">
        <div className="shell relative">
          <Link
            href="/projets"
            className="meta inline-flex items-center gap-2 hover:text-paper"
           
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Projets
          </Link>

          <h1 className="mt-8 font-display text-display font-semibold text-paper">
            <RevealLines lines={[project.name]} immediate delay={0.1} fit />
          </h1>

          <Reveal delay={0.25}>
            <p className="measure mt-6 text-lead text-paper/70">{project.tagline}</p>
          </Reveal>

          <dl className="mt-12 grid grid-cols-2 gap-y-8 border-t border-ink-line pt-8 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="meta">{fact.label}</dt>
                <dd className="mt-2 text-sm text-paper">{fact.value}</dd>
              </div>
            ))}
            <div>
              <dt className="meta">Site</dt>
              <dd className="mt-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer noopener"
                 
                  className="link-underline inline-flex items-center gap-1.5 text-sm text-paper"
                >
                  Visiter
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ---------------- full-bleed capture ---------------- */}
      <section className="relative mt-12 lg:mt-16" aria-label={`Aperçu de ${project.name}`}>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink-raised lg:aspect-[2/1]">
          <Image
            src={projectImage(project.slug)}
            alt={`Page d'accueil du site ${project.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        </div>
        <div className="shell">
          <Reveal>
            <p className="measure mt-8 text-lead text-paper/70">{project.summary}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- chapters ---------------- */}
      <div className="shell mt-16 lg:mt-24">
        <Chapter index="01" title="Contexte">
          <p className="text-paper/70">{project.context}</p>
        </Chapter>

        <Chapter index="02" title="Problématique">
          <p className="text-paper/70">{project.challenge}</p>
        </Chapter>

        <Chapter index="03" title="Solution">
          <p className="text-paper/70">{project.solution}</p>
        </Chapter>

        <Chapter index="04" title="Mon rôle">
          <ul className="space-y-3">
            {project.contribution.map((item) => (
              <li key={item} className="flex gap-4 text-paper/70">
                <span aria-hidden className="mt-[0.7em] h-px w-5 shrink-0 bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </Chapter>

        <Chapter index="05" title="Fonctionnalités">
          <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {project.features.map((item) => (
              <li key={item} className="text-paper/70">
                {item}
              </li>
            ))}
          </ul>
        </Chapter>

        {project.outcome && (
          <Chapter index="06" title="Résultat">
            <p className="font-display text-heading font-medium leading-tight text-paper">
              {project.outcome}
            </p>
          </Chapter>
        )}
      </div>

      {/* ---------------- gallery ---------------- */}
      <CaseGallery project={project} />

      {/* ---------------- prev / next ---------------- */}
      <nav className="shell border-t border-ink-line py-14" aria-label="Autres projets">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          {previous && (
            <Link href={`/projets/${previous.slug}`} className="group">
              <span className="meta inline-flex items-center gap-2">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Projet précédent
              </span>
              <p className="mt-2 font-display text-heading font-semibold text-paper">
                {previous.name}
              </p>
            </Link>
          )}
          {next && (
            <Link href={`/projets/${next.slug}`} className="group sm:text-right">
              <span className="meta inline-flex items-center gap-2 sm:flex-row-reverse">
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                Projet suivant
              </span>
              <p className="mt-2 font-display text-heading font-semibold text-paper">{next.name}</p>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
