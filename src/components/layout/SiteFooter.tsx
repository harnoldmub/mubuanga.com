import Link from "next/link";

import { profile } from "@/data/profile";
import { featuredProjects } from "@/data/projects";
import { nav } from "@/data/site";

const ELSEWHERE = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
  { label: "Instagram", href: profile.instagramUrl },
] as const;

const YEAR = new Date().getFullYear();

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-ink-line bg-ink">
      <div className="shell py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href="/" className="text-[1.375rem] font-semibold tracking-[-0.03em] text-paper">
              Arnold Mubuanga
            </Link>
            <p className="mt-3 max-w-[24rem] text-paper/65">
              Développeur, chef de projet et créateur de plateformes digitales. Entre Lille,
              Bruxelles et Kinshasa.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="link-underline mt-8 inline-block text-lg text-gold"
            >
              {profile.email}
            </a>
          </div>

          <nav aria-label="Plan du site" className="lg:col-span-2">
            <p className="meta">Site</p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/75 transition-colors hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Projets récents" className="lg:col-span-3">
            <p className="meta">Projets récents</p>
            <ul className="mt-4 space-y-2">
              {featuredProjects.filter((p) => !p.comingSoon).slice(0, 6).map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projets/${project.slug}`}
                    className="text-paper/75 transition-colors hover:text-paper"
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Réseaux" className="lg:col-span-2">
            <p className="meta">Ailleurs</p>
            <ul className="mt-4 space-y-2">
              {ELSEWHERE.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-paper/75 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`tel:${profile.phone}`} className="text-paper/75 transition-colors hover:text-paper">
                  {profile.phoneDisplay}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-ink-line pt-6 text-sm text-grey">
          <p>© {YEAR} Arnold Mubuanga Yate</p>
          <p>{profile.availability}</p>
        </div>
      </div>
    </footer>
  );
}
