import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import { services } from "@/data/site";

/**
 * Four offers as four columns. On hover the gold rule draws across, the
 * deliverables brighten — a small
 * reward for pointing at something, never motion for its own sake.
 */
export default function Builds() {
  return (
    <section className="shell py-section" aria-labelledby="builds-title">
      <div className="section-head">
        <h2 id="builds-title" className="text-title font-semibold text-paper">
          <RevealLines lines={["Ce que je construis"]} />
        </h2>
        <Reveal>
          <p className="text-paper/70">
            Quatre types de projets, une même façon de travailler : comprendre le métier, puis
            livrer quelque chose qui tient en production.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid border-t border-ink-line sm:grid-cols-2 lg:grid-cols-4 lg:[&>*:first-child>a]:pl-0 lg:[&>*:last-child>a]:border-r-0">
        {services.map((service, i) => (
          <Reveal key={service.id} delay={i * 0.06} className="h-full">
            <Link
              href={`/services#${service.id}`}
              className="build-card group relative flex h-full flex-col border-b border-ink-line py-8 sm:px-6 lg:border-b-0 lg:border-r lg:px-7 lg:py-10"
            >
              <span
                aria-hidden
                className="absolute left-0 top-[-1px] h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              <h3 className="text-heading font-semibold text-paper transition-transform duration-500 ease-expo group-hover:translate-x-1">
                {service.title}
              </h3>
              <p className="mt-4 text-paper/70">{service.lead}</p>

              <ul className="build-list mt-8 space-y-1.5 pb-2 text-sm text-grey">
                {service.deliverables.map((item, j) => (
                  <li
                    key={item}
                    className="transition-[color,transform] duration-500 ease-expo group-hover:text-paper/90"
                    style={{ transitionDelay: `${j * 40}ms` }}
                  >
                    {item}
                  </li>
                ))}
              </ul>

            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
