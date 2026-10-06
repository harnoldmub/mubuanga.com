import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import RevealLines from "@/components/ui/RevealLines";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";
import StackMarks from "@/components/ui/StackMarks";
import ContactCta from "@/components/home/ContactCta";
import { ArrowUpRight } from "@/components/ui/Icons";
import {
  aboutLines,
  aboutParagraphs,
  approach,
  experiences,
  languages,
  profile,
  references,
  stack,
  stackMarks,
  ventures,
} from "@/data/profile";
import { figures } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "À propos",
  description:
    "Arnold Mubuanga Yate — ingénieur développement et chef de projet informatique à la Ville de Lille, ancien de Dassault Systèmes, entrepreneur digital. Parcours, approche et compétences.",
  path: "/about",
  type: "profile",
});

export default function AboutPage() {
  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative pb-16 pt-[calc(var(--header-h)+clamp(4rem,10vw,8rem))]">
                <div className="shell relative">
          <p className="text-gold">{profile.role}</p>
          <h1 className="mt-6 text-display font-semibold text-paper">
            <RevealLines lines={aboutLines} immediate delay={0.1} />
          </h1>
        </div>
      </section>

      {/* ---------------- portrait + intro ---------------- */}
      <section className="shell relative pb-section" aria-label="Présentation">
        <div className="grid-12 items-end">
          <div className="col-span-6 md:col-span-5 lg:col-span-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink-raised">
              <Image
                src="/assets/portraits/arnold-portrait.webp"
                alt={`Portrait d'${profile.name}`}
                fill
                priority
                sizes="(max-width: 767px) 84vw, 32vw"
                className="object-cover object-top"
              />
            </div>
            <p className="meta mt-4">{profile.name}</p>
          </div>

          <div className="col-span-6 mt-10 md:col-span-7 md:mt-0 lg:col-span-7 lg:col-start-6">
            {aboutParagraphs.map((paragraph, i) => (
              <Reveal key={paragraph} delay={i * 0.06}>
                <p
                  className={
                    i === 0
                      ? "measure text-lead text-paper"
                      : "measure mt-5 text-paper/60"
                  }
                >
                  {paragraph}
                </p>
              </Reveal>
            ))}

            <ul className="mt-12 grid grid-cols-3 gap-6 border-t border-ink-line pt-8">
              {figures.slice(0, 3).map((stat) => (
                <li key={stat.label}>
                  <p className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums text-paper">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm leading-5 text-paper/60">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------------- approach ---------------- */}
      <section className="on-paper bg-paper py-section text-ink" aria-labelledby="approach-title">
        <div className="shell">
          <h2 id="approach-title" className="text-title font-semibold">
            <RevealLines lines={["De l'idée", "à la production"]} />
          </h2>
          <ol className="mt-14 lg:mt-20">
            {approach.map((item, i) => (
              <Reveal
                as="li"
                key={item.step}
                delay={i * 0.06}
                className="grid-12 items-baseline border-t border-paper-line py-7 last:border-b lg:py-9"
              >
                <span className="col-span-1 text-sm tabular-nums text-[#7a5f2c]">{item.step}</span>
                <h3 className="col-span-5 font-display text-heading font-semibold md:col-span-11 lg:col-span-4">
                  {item.title}
                </h3>
                <p className="col-span-6 mt-3 text-ink/60 md:col-span-12 lg:col-span-6 lg:col-start-7 lg:mt-0">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- experience ---------------- */}
      <section id="experience" className="scroll-mt-24 py-section" aria-labelledby="experience-title">
        <div className="shell">
          <p className="meta">Parcours</p>
          <h2 id="experience-title" className="mt-6 text-title font-semibold text-paper">
            <RevealLines lines={["Depuis 2018"]} />
          </h2>

          <ol className="mt-14 lg:mt-20">
            {experiences.map((item, i) => (
              <Reveal
                as="li"
                key={item.company + item.period}
                delay={i * 0.06}
                className="border-t border-ink-line last:border-b"
              >
                <div className="grid-12 py-9 lg:py-12">
                  <div className="col-span-6 md:col-span-3 lg:col-span-2">
                    <p className="text-sm tabular-nums text-gold">{item.period}</p>
                    <p className="meta mt-2">{item.periodLabel}</p>
                  </div>

                  <div className="col-span-6 mt-4 md:col-span-9 md:mt-0 lg:col-span-5">
                    <h3
                      className={
                        item.major
                          ? "font-display text-title font-semibold text-paper"
                          : "font-display text-heading font-semibold text-paper/80"
                      }
                    >
                      {item.company}
                    </h3>
                    <p className="mt-3 text-paper/60">{item.role}</p>
                    <p className="measure mt-4 text-sm leading-6 text-paper/55">{item.summary}</p>
                  </div>

                  <div className="col-span-6 mt-6 md:col-span-12 lg:col-span-4 lg:col-start-9 lg:mt-0">
                    <ul className="space-y-2">
                      {item.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3 text-sm leading-6 text-paper/60">
                          <span aria-hidden className="mt-[0.72em] h-px w-4 shrink-0 bg-gold" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                      {item.stack.map((tech) => (
                        <li key={tech} className="meta">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- references marquee ---------------- */}
      <section className="border-y border-ink-line py-6" aria-label="Organisations">
        <Marquee
          items={references}
          duration={52}
          itemClassName="font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-medium tracking-[-0.03em] text-paper/55"
        />
      </section>

      {/* ---------------- ventures + stack ---------------- */}
      <section className="py-section" aria-labelledby="ventures-title">
        <div className="shell grid-12">
          <div className="col-span-6 md:col-span-12 lg:col-span-5">
            <h2 id="ventures-title" className="font-display text-title font-semibold text-paper">
              Mes produits
            </h2>
            <p className="measure mt-5 text-paper/60">
              Ce que je construis pour moi. C&apos;est là que je cadre, que j&apos;arbitre et que je
              livre sans filet — et c&apos;est ce qui rend le reste plus solide.
            </p>
          </div>

          <ul className="col-span-6 mt-10 md:col-span-12 lg:col-span-6 lg:col-start-7 lg:mt-0">
            {ventures.map((venture, i) => (
              <Reveal
                as="li"
                key={venture.name}
                delay={i * 0.05}
                className="border-t border-ink-line last:border-b"
              >
                <a
                  href={venture.url}
                  target="_blank"
                  rel="noreferrer"
                 
                  className="group flex items-start justify-between gap-6 py-6"
                >
                  <span>
                    <span className="font-display text-heading font-semibold text-paper">
                      {venture.name}
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-paper/50">
                      {venture.body}
                    </span>
                  </span>
                  <ArrowUpRight className="mt-2 h-4 w-4 shrink-0 text-paper/55 transition-transform duration-300 ease-expo group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-paper" />
                </a>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="shell mt-20 grid-12">
          <div className="col-span-6 md:col-span-12 lg:col-span-3">
            <p className="meta">Stack</p>
          </div>
          <div className="col-span-6 mt-4 md:col-span-12 lg:col-span-9 lg:mt-0">
            <StackMarks className="flex flex-wrap gap-x-8 gap-y-4" />
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {stack
                .filter((tech) => !stackMarks.some((mark) => mark.name === tech))
                .map((tech) => (
                  <li key={tech} className="meta text-paper/65">
                    {tech}
                  </li>
                ))}
            </ul>
          </div>

          <div className="col-span-6 mt-14 md:col-span-12 lg:col-span-3 lg:mt-16">
            <p className="meta">Langues</p>
          </div>
          <ul className="col-span-6 mt-4 flex flex-wrap gap-x-8 gap-y-3 md:col-span-12 lg:col-span-9 lg:mt-16">
            {languages.map((language) => (
              <li key={language.name} className="text-paper/65">
                {language.name}
                <span className="meta ml-2">{language.level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="shell mt-16">
          <Link
            href="/projets"
            className="btn btn-ghost"
           
          >
            Voir les projets
            <ArrowUpRight className="arrow h-4 w-4" />
          </Link>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
