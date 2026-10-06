import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { ArrowDown, ArrowUpRight } from "@/components/ui/Icons";
import ShareLink from "@/components/ui/ShareLink";
import { profile } from "@/data/profile";
import { buildMetadata, siteUrl } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Carte de visite",
  description: "Carte de visite numérique d'Arnold Mubuanga Yate.",
  path: "/carte",
  noIndex: true,
});

const CHANNELS = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Téléphone", value: profile.phoneDisplay, href: `tel:${profile.phone}` },
  { label: "LinkedIn", value: "arnold-mubuanga-yate", href: profile.linkedin },
  { label: "Instagram", value: `@${profile.instagram}`, href: profile.instagramUrl },
  { label: "Site", value: "mubuanga.com", href: siteUrl },
] as const;

/**
 * Read on a phone, seconds after a handshake. So: one column, the portrait at
 * full bleed, and every action a thumb-sized row. The desktop view keeps the
 * same card rather than stretching it across the viewport.
 */
export default function CartePage() {
  return (
    <section className="pb-20 pt-[var(--header-h)]">
      <div className="mx-auto w-full max-w-[36rem] px-gutter">
        {/* ---- portrait, with the name breaking over its lower edge ---- */}
        <div className="relative mt-8">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-raised">
            <Image
              src="/assets/portraits/arnold-portrait.webp"
              alt={`Portrait d'${profile.name}`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 36rem"
              className="object-cover object-[50%_12%]"
            />
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent"
            />
          </div>

          <div className="relative -mt-16 px-1">
            <p className="meta meta-gold">{profile.shortName}</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,8.5vw,3.1rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-paper">
              Arnold
              <br />
              Mubuanga Yate
            </h1>
            <p className="mt-4 text-sm leading-6 text-paper/60">{profile.role}</p>
          </div>
        </div>

        {/* ---- the primary action ---- */}
        <a
          href="/carte/vcard"
          download="arnold-mubuanga-yate.vcf"
          className="btn btn-primary mt-8 w-full justify-center"
         
        >
          Ajouter à mes contacts
          <ArrowDown className="h-4 w-4" />
        </a>

        {/* ---- channels ---- */}
        <ul className="mt-10">
          {CHANNELS.map((channel) => (
            <li key={channel.label} className="border-t border-ink-line last:border-b">
              <a
                href={channel.href}
                {...(channel.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
               
                className="group flex min-h-[4.25rem] items-center justify-between gap-4 py-4"
              >
                <span className="flex flex-col gap-1">
                  <span className="meta">{channel.label}</span>
                  <span className="font-display text-base font-medium tracking-[-0.01em] text-paper transition-colors duration-300 group-hover:text-gold">
                    {channel.value}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-paper/50 transition-transform duration-300 ease-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
              </a>
            </li>
          ))}
        </ul>

        {/* ---- share ---- */}
        <ShareLink url={`${siteUrl}/carte`} />

        <div className="mt-10 flex flex-col gap-2 border-t border-ink-line pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="meta">{profile.role}</p>
          <Link
            href="/projets"
            className="meta inline-flex min-h-11 items-center hover:text-paper"
           
          >
            Voir mes projets →
          </Link>
        </div>
      </div>
    </section>
  );
}
