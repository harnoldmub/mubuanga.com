import type { Metadata } from "next";

import ContactCta from "@/components/home/ContactCta";
import LabField from "@/components/three/LabField";
import Reveal from "@/components/ui/Reveal";
import RevealLines from "@/components/ui/RevealLines";
import { labExperiments } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Lab",
  description:
    "La partie expérimentale du studio : WebGL, interfaces immersives, visualisation de données et IA appliquée aux projets clients.",
  path: "/lab",
});

const PRINCIPLES = [
  {
    title: "Une image de repli, toujours",
    body: "Chaque scène 3D a une version fixe pour les téléphones modestes, les connexions lentes et les personnes qui réduisent les animations.",
  },
  {
    title: "Le budget avant l'effet",
    body: "Une scène = quelques appels de rendu, pas de post-traitement lourd, une pause dès qu'elle sort de l'écran.",
  },
  {
    title: "L'IA sous contrôle humain",
    body: "Les assistants répondent à partir du contenu réel du client, et toute action qui engage quelqu'un passe par une validation.",
  },
] as const;

export default function LabPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden" aria-labelledby="lab-page-title">
        <LabField className="absolute inset-0 -z-10 bg-night-deep" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-t from-ink via-ink/20 to-transparent"
        />
        <div className="shell flex min-h-[88svh] flex-col justify-end pb-14 pt-[calc(var(--header-h)+4rem)]">
          <h1 id="lab-page-title" className="text-display font-semibold text-paper">
            <RevealLines lines={["Lab"]} immediate delay={0.1} />
          </h1>
          <Reveal immediate delay={0.25}>
            <p className="mt-6 max-w-[38rem] text-lead text-paper/75">
              Ce que je teste avant de le mettre dans un projet client. Le champ derrière ce texte
              est une scène WebGL : déplacez le pointeur dessus.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="shell py-section">
        {labExperiments.map((item, i) => (
          <section
            key={item.id}
            id={item.id}
            className="grid scroll-mt-[calc(var(--header-h)+1rem)] gap-6 border-t border-ink-line py-12 lg:grid-cols-12 lg:py-16"
            aria-labelledby={`${item.id}-title`}
          >
            <p className="text-sm tabular-nums text-gold lg:col-span-1">{String(i + 1).padStart(2, "0")}</p>
            <h2 id={`${item.id}-title`} className="text-title font-semibold text-paper lg:col-span-4">
              <RevealLines lines={[item.title]} />
            </h2>
            <Reveal className="lg:col-span-6 lg:col-start-7">
              <p className="text-lead text-paper/80">{item.body}</p>
              <p className="mt-6 text-sm text-grey">
                Utilisé sur : <span className="text-paper/85">{item.used}</span>
              </p>
            </Reveal>
          </section>
        ))}
      </div>

      <section className="border-t border-ink-line bg-night" aria-labelledby="lab-rules-title">
        <div className="shell py-section">
          <h2 id="lab-rules-title" className="text-title font-semibold text-paper">
            <RevealLines lines={["Trois règles du Lab"]} />
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {PRINCIPLES.map((rule, i) => (
              <Reveal key={rule.title} delay={i * 0.06} className="border-t border-ink-line pt-6">
                <h3 className="text-heading font-semibold text-paper">{rule.title}</h3>
                <p className="mt-4 text-paper/70">{rule.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
