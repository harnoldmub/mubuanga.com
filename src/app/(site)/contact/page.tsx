import type { Metadata } from "next";

import ContactForm from "@/components/ui/ContactForm";
import RevealLines from "@/components/ui/RevealLines";
import Reveal from "@/components/ui/Reveal";
import { ArrowUpRight } from "@/components/ui/Icons";
import { contactLines, profile } from "@/data/profile";
import { buildMetadata, JsonLd, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Parlons de votre produit, de votre application métier ou de votre plateforme. Écrire à Arnold Mubuanga Yate (AMY).",
  path: "/contact",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  url: `${siteUrl}/contact`,
  mainEntity: { "@id": `${siteUrl}/#person` },
};

const CHANNELS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Téléphone", value: profile.phoneDisplay, href: `tel:${profile.phone}` },
  { label: "LinkedIn", value: "arnold-mubuanga-yate", href: profile.linkedin },
  { label: "Instagram", value: `@${profile.instagram}`, href: profile.instagramUrl },
] as const;

export default function ContactPage() {
  return (
    <>
      <JsonLd data={jsonLd} />

      <section className="relative pb-16 pt-[calc(var(--header-h)+clamp(4rem,10vw,8rem))]">
                <div className="shell relative">
          <p className="flex items-center gap-2 text-paper/75"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-congo shadow-[0_0_0_3px_rgba(31,107,78,0.25)]" />{profile.availability}</p>
          <h1 className="mt-6 text-display font-semibold text-paper">
            <RevealLines lines={contactLines} immediate delay={0.1} />
          </h1>
          <Reveal delay={0.3}>
            <p className="measure mt-8 text-lead text-paper/70">
              Une idée à cadrer, un produit à construire, une équipe à renforcer. Dites-moi le
              contexte et l&apos;échéance — je réponds avec un avis honnête, y compris quand ce
              n&apos;est pas moi qu&apos;il vous faut.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="shell pb-section" aria-label="Formulaire et coordonnées">
        <div className="grid-12 items-start border-t border-ink-line pt-12">
          <div className="col-span-6 md:col-span-12 lg:col-span-7">
            <ContactForm />
          </div>

          <div className="col-span-6 mt-16 md:col-span-12 lg:col-span-4 lg:col-start-9 lg:mt-0">
            <ul>
              {CHANNELS.map((channel) => (
                <li key={channel.label} className="border-t border-ink-line last:border-b">
                  <a
                    href={channel.href}
                    {...(channel.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                   
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span className="meta">{channel.label}</span>
                    <span className="flex items-center gap-2 text-sm text-paper transition-colors duration-300 group-hover:text-gold">
                      {channel.value}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </section>
    </>
  );
}
