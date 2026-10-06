import Link from "next/link";

import Arcade404 from "@/components/games/Arcade404";
import SiteChrome from "@/components/layout/SiteChrome";

import RevealLines from "@/components/ui/RevealLines";
import { ArrowLeft } from "@/components/ui/Icons";
import { featuredProjects } from "@/data/projects";

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="relative flex min-h-[100svh] flex-col justify-between pt-[var(--header-h)]">

      <div className="shell relative flex flex-1 flex-col justify-center py-16">
        <p className="meta meta-gold">Erreur 404</p>
        <h1 className="mt-6 font-display text-mega font-semibold text-paper">
          <RevealLines lines={["404", "VOUS ÊTES", "HORS PISTE."]} immediate delay={0.1} fit />
        </h1>
        <p className="measure mt-8 text-lead text-paper/70">
          Cette page n&apos;existe pas. Autant jouer un peu avant de repartir.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
          <Link href="/projets" className="btn btn-ghost">
            Voir les projets
          </Link>
        </div>

        <Arcade404 />
      </div>

      <div className="shell relative border-t border-ink-line py-6">
        <p className="meta">Projets récents</p>
        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {featuredProjects.slice(0, 4).map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projets/${project.slug}`}
                className="link-underline font-display text-lg font-medium tracking-[-0.02em] text-paper/70 hover:text-paper"
               
              >
                {project.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      </section>
    </SiteChrome>
  );
}
