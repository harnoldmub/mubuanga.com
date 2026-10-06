import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";

import "./globals.css";
import { profile } from "@/data/profile";
import { defaultDescription, identityJsonLd, JsonLd, metadataBase, siteName } from "@/lib/seo";

// One family for everything: Inter Tight holds a tight display setting and
// stays readable at body size, so hierarchy comes from size and weight alone.
const sans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "Arnold Mubuanga — Développeur, chef de projet, plateformes digitales",
    template: `%s — ${profile.shortName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: profile.name, url: profile.linkedin }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "none" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName,
    title: "Arnold Mubuanga — Développeur, chef de projet, plateformes digitales",
    description: defaultDescription,
  },
  twitter: {
    card: "summary",
    title: "Arnold Mubuanga — Développeur, chef de projet, plateformes digitales",
    description: defaultDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={sans.variable} suppressHydrationWarning>
      <head>
        {/*
          Marks the document as scripted before first paint. Every hidden
          reveal start-state is scoped to `.js`, so without JavaScript the page
          renders finished instead of blank.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }}
        />
      </head>
      <body>
        <JsonLd data={identityJsonLd} />
        <a href="#main" className="skip-link">
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
