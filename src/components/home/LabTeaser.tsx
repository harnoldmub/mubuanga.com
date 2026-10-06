import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import { labExperiments } from "@/data/site";

export default function LabTeaser() {
  return (
    <section className="relative py-section" aria-labelledby="lab-title">
      <div className="shell">
        <div className="section-head">
          <h2 id="lab-title" className="text-title font-semibold text-paper">
            <RevealLines lines={["Le Lab"]} />
          </h2>
          <Reveal>
            <p className="text-paper/70">
              La partie expérimentale du studio : ce que je teste ici finit dans les projets clients.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="shell">
        <ul className="grid border-b border-ink-line sm:grid-cols-2 lg:grid-cols-4">
          {labExperiments.map((item, i) => (
            <Reveal key={item.id} as="li" delay={i * 0.05}>
              <Link
                href={`/lab#${item.id}`}
                className="group block h-full border-ink-line py-7 sm:pr-6 lg:border-r lg:px-6 lg:first:pl-0"
              >
                <h3 className="text-lg font-semibold text-paper transition-colors duration-300 group-hover:text-gold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-paper/65">{item.body}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
