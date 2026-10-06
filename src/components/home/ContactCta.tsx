import Link from "next/link";

import Magnetic from "@/components/ui/Magnetic";
import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import { profile } from "@/data/profile";

export default function ContactCta() {
  return (
    <section className="border-t border-ink-line bg-night" aria-labelledby="cta-title">
      <div className="shell grid gap-10 py-section lg:grid-cols-12 lg:items-end">
        <h2 id="cta-title" className="text-title font-semibold text-paper lg:col-span-8">
          <RevealLines
            lines={["Un projet sérieux mérite une interface", "claire, rapide et mémorable."]}
            lineClassName="balance"
          />
        </h2>
        <Reveal className="lg:col-span-4">
          <p className="text-paper/70">
            Dites-moi le contexte, l&apos;échéance et ce qui doit exister en premier. Je réponds
            sous 48 heures avec un avis franc.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Magnetic>
              <Link href="/contact" className="btn btn-primary">
                Discuter du projet
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost">
                Envoyer un mail
              </a>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
