import type { MetadataRoute } from "next";

import { publishedProjects } from "@/data/projects";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/projets`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    ...publishedProjects.map((project) => ({
      url: `${siteUrl}/projets/${project.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
