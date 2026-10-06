import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import ContactCta from "@/components/home/ContactCta";
import Process from "@/components/home/Process";
import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import { getProject, projectImage } from "@/data/projects";
import { services } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Sites premium, applications web, back-offices métier et expériences 3D ou IA : ce que conçoit et développe Arnold Mubuanga, de la note de cadrage à la mise en production.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <section className="pb-16 pt-[calc(var(--header-h)+clamp(3.5rem,8vw,7rem))]">
        <div className="shell">
          <h1 className="text-display font-semibold text-paper">
            <RevealLines lines={["Services"]} immediate delay={0.1} />
          </h1>
          <Reveal immediate delay={0.25}>
            <p className="mt-6 max-w-[42rem] text-lead text-paper/70">
              Un seul interlocuteur du cadrage à la mise en ligne. Je conçois, je développe et je
              pilote — avec des partenaires de confiance quand le projet le demande.
            </p>
          </Reveal>
          <Reveal immediate delay={0.35}>
            <nav aria-label="Services" className="mt-10 flex flex-wrap gap-2">
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`#${service.id}`}
                  className="rounded-sm border border-ink-line px-3.5 py-2 text-sm text-paper/80 transition-colors hover:border-paper/40 hover:text-paper"
                >
                  {service.title}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      <div className="shell pb-section">
        {services.map((service) => {
          const examples = service.examples
            .map((slug) => getProject(slug))
            .filter((p): p is NonNullable<typeof p> => Boolean(p));
          return (
            <section
              key={service.id}
              id={service.id}
              className="scroll-mt-[calc(var(--header-h)+1rem)] border-t border-ink-line py-14 lg:py-20"
              aria-labelledby={`${service.id}-title`}
            >
              <div className="grid gap-10 lg:grid-cols-12">
                <div className="lg:col-span-5">
                  <h2 id={`${service.id}-title`} className="text-title font-semibold text-paper">
                    <RevealLines lines={[service.title]} />
                  </h2>
                  <Reveal>
                    <p className="mt-5 text-lead text-paper/80">{service.lead}</p>
                    <p className="mt-4 text-paper/65">{service.body}</p>
                  </Reveal>
                </div>

                <Reveal className="grid gap-8 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
                  <div>
                    <h3 className="meta">Ce que vous recevez</h3>
                    <ul className="mt-4 space-y-2.5">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex gap-3 text-paper/85">
                          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-gold" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="meta">Outils</h3>
                    <p className="mt-4 text-paper/85">{service.stack.join(", ")}</p>
                  </div>
                </Reveal>
              </div>

              {examples.length > 0 && (
                <div className="mt-12">
                  <p className="meta">Exemples</p>
                  <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {examples.map((project, i) => (
                      <Reveal key={project.slug} as="li" delay={i * 0.06}>
                        <Link href={`/projets/${project.slug}`} className="group block">
                          <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-ink-raised">
                            <Image
                              src={projectImage(project.slug)}
                              alt={`Page d'accueil du site ${project.name}`}
                              fill
                              sizes="(max-width: 1023px) 50vw, 30vw"
                              className="object-cover object-top transition-transform duration-[1.2s] ease-expo group-hover:scale-[1.03]"
                            />
                            <span className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-ink-line" />
                          </div>
                          <p className="mt-3 flex justify-between gap-4 text-sm">
                            <span className="text-paper">{project.name}</span>
                            <span className="text-grey group-hover:text-gold">Voir le projet</span>
                          </p>
                        </Link>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <Process />
      <ContactCta />
    </>
  );
}
