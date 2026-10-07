"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import Magnetic from "@/components/ui/Magnetic";
import { WhatsAppIcon } from "@/components/ui/Icons";
import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import { profile } from "@/data/profile";

const CLOCKS = [
  { city: "Kinshasa", zone: "Africa/Kinshasa" },
  { city: "Bruxelles", zone: "Europe/Brussels" },
  { city: "Lille", zone: "Europe/Paris" },
] as const;

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export default function Hero() {
  const now = useClock();

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink"
      aria-labelledby="hero-title"
    >
      {/* depth: a night-blue floor under the poster */}
      <div aria-hidden className="hero-floor absolute inset-0 -z-10" />

      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/assets/hero/globe-poster.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover object-right lg:block"
        />
        <Image
          src="/assets/hero/globe-poster-mobile.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top lg:hidden"
        />
      </div>

      {/* legibility on narrow screens, where the text sits over the globe */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-3/4 bg-gradient-to-t from-ink via-ink/85 to-transparent lg:hidden"
      />

      <div className="shell relative mt-auto pb-10 pt-[calc(var(--header-h)+2rem)] lg:static lg:my-auto lg:pb-[calc(var(--header-h)+2rem)]">
        <div className="max-w-[52rem]">
          <h1
            id="hero-title"
            className="text-[clamp(1.65rem,3.8vw,3.3rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-paper"
          >
            <RevealLines
              lines={["Développeur, chef de projet", "et créateur de plateformes digitales."]}
              immediate
              delay={0.15}
            />
          </h1>
          <Reveal immediate delay={0.45}>
            <p className="mt-4 max-w-[36rem] text-paper/70">
              Je conçois des sites, applications, back-offices et expériences digitales pour des
              marques, institutions, événements et projets ambitieux.
            </p>
          </Reveal>
          <Reveal immediate delay={0.55}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link href="/projets" className="btn btn-primary">
                  Voir les projets
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={profile.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-ghost"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  Contactez-moi
                </a>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <Reveal immediate delay={0.7}>
          <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-ink-line pt-5 text-sm sm:max-w-xl lg:absolute lg:bottom-14 lg:right-[var(--gutter)] lg:mt-0 lg:w-[26rem]">
            {CLOCKS.map((clock) => (
              <div key={clock.city}>
                <dt className="text-grey">{clock.city}</dt>
                <dd className="mt-1 tabular-nums text-paper" suppressHydrationWarning>
                  {now
                    ? new Intl.DateTimeFormat("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: clock.zone,
                      }).format(now)
                    : "--:--"}
                </dd>
              </div>
            ))}
            <p className="col-span-3 mt-2 flex items-center gap-2 text-grey">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-congo shadow-[0_0_0_3px_rgba(31,107,78,0.25)]" />
              {profile.availability}
            </p>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
