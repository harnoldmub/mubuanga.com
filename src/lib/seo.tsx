import type { Metadata } from "next";

import { profile } from "@/data/profile";

const FALLBACK = "https://www.mubuanga.com";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL && /^https?:\/\//.test(process.env.NEXT_PUBLIC_SITE_URL)
    ? process.env.NEXT_PUBLIC_SITE_URL
    : FALLBACK
).replace(/\/$/, "");

export const metadataBase = new URL(siteUrl);
export const siteName = "Arnold Mubuanga";

export const defaultDescription =
  "Arnold Mubuanga, développeur et chef de projet : sites premium, applications web, back-offices métier et expériences 3D ou IA pour des marques, institutions et événements, entre la France, la Belgique et la RDC.";

export function buildMetadata({
  title,
  description = defaultDescription,
  path = "/",
  type = "website",
  noIndex = false,
}: {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "none" },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "fr_FR",
      type,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/** Person + WebSite graph, emitted once from the root layout. */
export const identityJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: profile.name,
      alternateName: profile.shortName,
      url: siteUrl,
      email: `mailto:${profile.email}`,
      jobTitle: "Software Engineer · Product Builder · IT Project Lead",
      description: defaultDescription,
      knowsAbout: [
        "Software engineering",
        "Product design",
        "IT project management",
        "Web platforms",
        "Digital transformation",
      ],
      knowsLanguage: ["fr", "en", "ln"],
      worksFor: { "@type": "Organization", name: "Ville de Lille" },
      alumniOf: { "@type": "Organization", name: "Dassault Systèmes" },
      sameAs: [profile.linkedin, profile.instagramUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description: defaultDescription,
      inLanguage: "fr-FR",
      publisher: { "@id": `${siteUrl}/#person` },
    },
  ],
};

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Data is authored in this repository, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
