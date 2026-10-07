/**
 * Single source of truth for everything the site says about Arnold.
 * Editing this file is enough to update the whole portfolio.
 */

export const profile = {
  name: "Arnold Mubuanga Yate",
  shortName: "AMY",
  role: "Développeur, chef de projet informatique, créateur de plateformes digitales",
  eyebrow: "Software Engineer · Product Builder",
  email: "arnold@mubuanga.com",
  phone: "+33698827193",
  phoneDisplay: "+33 6 98 82 71 93",
  whatsapp: "32492652757",
  whatsappDisplay: "+32 492 65 27 57",
  whatsappUrl: "https://wa.me/32492652757",
  instagram: "harnold_mub",
  instagramUrl: "https://www.instagram.com/harnold_mub/",
  linkedin: "https://www.linkedin.com/in/arnold-mubuanga-yate-149b7b151",
  github: "https://github.com/harnoldmub",
  availability: "Ouvert aux missions et collaborations",
  // Hero
  heroLines: ["JE CONSTRUIS", "DES PRODUITS", "NUMÉRIQUES."] as const,
  heroSubtitle:
    "Je transforme des idées, des besoins métiers et des opportunités en produits numériques réellement utilisables — de la conception à la mise en production.",
  // Manifesto
  manifestoWords: ["INGÉNIERIE", "PRODUIT", "MÉTIER"] as const,
  manifesto:
    "Je construis à l'intersection de la technologie, du produit et des usages. Comprendre une idée, la cadrer, concevoir la solution, l'écrire, la livrer : c'est la même chaîne, et je la tiens de bout en bout.",
  manifestoSecondary:
    "Le code n'est jamais le point de départ. Le point de départ, c'est un métier à comprendre, des contraintes à accepter et des gens qui vont devoir se servir du résultat tous les jours.",
} as const;

export const stats = [
  { value: "6+", label: "années d'expérience" },
  { value: "50+", label: "projets réalisés ou accompagnés", note: "Web, métier, SaaS" },
  { value: "FULL-STACK", label: "conception, développement, production", note: "De la maquette à la mise en ligne" },
] as const;

export const aboutLines = ["Je construis", "ce qui sert."] as const;

export const aboutParagraphs = [
  "Je suis Arnold Mubuanga Yate. Ingénieur en développement et chef de projet informatique à la Ville de Lille, entrepreneur digital le reste du temps.",
  "Depuis plus de six ans, je conçois et développe des applications web, des plateformes métier, des systèmes d'information et des produits SaaS pour des organisations publiques, des entreprises et des porteurs de projets.",
  "Avant Lille, j'ai passé six ans chez Dassault Systèmes, dans l'équipe R&D de NETVIBES, sur 3DSearch — une plateforme de recherche utilisée à l'échelle internationale. J'y ai appris ce que veut dire construire pour l'échelle, la performance et la durée.",
  "Le reste de mon temps part dans mes propres produits : plateformes événementielles, outils SaaS, studios créatifs. C'est là que j'apprends le plus vite, parce qu'il n'y a personne d'autre pour cadrer, arbitrer ou livrer.",
] as const;

export const approach = [
  {
    step: "01",
    title: "Comprendre",
    body: "Le métier avant l'outil. Je cadre le besoin réel, les contraintes et ce qui doit exister en premier.",
  },
  {
    step: "02",
    title: "Concevoir",
    body: "Architecture, parcours, modèle de données. Les décisions structurantes se prennent avant la première ligne de code.",
  },
  {
    step: "03",
    title: "Construire",
    body: "Développement full-stack, interfaces soignées, code lisible et maintenable par quelqu'un d'autre que moi.",
  },
  {
    step: "04",
    title: "Livrer",
    body: "Mise en production, accompagnement des utilisateurs, corrections, itérations. Un produit qui ne sert pas n'est pas fini.",
  },
] as const;

export const capabilities = [
  {
    number: "01",
    title: "Produits numériques",
    body: "Applications, plateformes et outils métier conçus pour un usage quotidien réel.",
  },
  {
    number: "02",
    title: "Ingénierie logicielle",
    body: "Architecture applicative, développement full-stack, API et intégrations.",
  },
  {
    number: "03",
    title: "Pilotage de projets",
    body: "Cadrage, coordination des parties prenantes, arbitrages et mise en production.",
  },
  {
    number: "04",
    title: "Expériences digitales",
    body: "Sites et expériences web premium, direction artistique et motion.",
  },
  {
    number: "05",
    title: "Stratégie produit",
    body: "Transformer un besoin métier flou en produit réalisable et priorisé.",
  },
] as const;

export const stack = [
  "TypeScript", "React", "Next.js", "Angular", "Node.js", "NestJS",
  "PHP 8", "Symfony", "API Platform", "PostgreSQL", "MySQL", "Docker",
  "GitLab CI/CD", "REST", "SCSS", "Tailwind",
] as const;

export const stackMarks = [
  { name: "TypeScript", icon: "/assets/icons/typescript.svg" },
  { name: "React", icon: "/assets/icons/react.svg" },
  { name: "Next.js", icon: "/assets/icons/nextdotjs.svg" },
  { name: "Angular", icon: "/assets/icons/angular.svg" },
  { name: "Node.js", icon: "/assets/icons/nodedotjs.svg" },
  { name: "NestJS", icon: "/assets/icons/nestjs.svg" },
  { name: "Symfony", icon: "/assets/icons/symfony.svg" },
  { name: "PHP", icon: "/assets/icons/php.svg" },
  { name: "JavaScript", icon: "/assets/icons/javascript.svg" },
  { name: "Sass", icon: "/assets/icons/sass.svg" },
  { name: "HTML5", icon: "/assets/icons/html5.svg" },
  { name: "CSS3", icon: "/assets/icons/css3.svg" },
] as const;

export const experiences = [
  {
    period: "2024 —",
    periodLabel: "Depuis novembre 2024",
    year: "2024",
    company: "Ville de Lille",
    role: "Ingénieur en développement · Chef de projet informatique",
    summary:
      "Je pilote et développe les applications métier des services municipaux et des associations lilloises, avec une double casquette technique et fonctionnelle.",
    highlights: [
      "Développement d'applications métier pour les services municipaux",
      "Pilotage technique et fonctionnel de projets numériques",
      "Conception d'API et d'interfaces web modernes",
      "Accompagnement des utilisateurs et des équipes métier",
    ],
    stack: ["PHP 8", "Symfony", "API Platform", "Angular", "Docker", "Pilotage"],
    major: true,
  },
  {
    period: "2021 — 2024",
    periodLabel: "2021 — 2024",
    year: "2021",
    company: "Dassault Systèmes",
    role: "Software Engineering Specialist · 3DSearch, NETVIBES",
    summary:
      "Développement de fonctionnalités stratégiques de 3DSearch, la plateforme de recherche transverse de la 3DEXPERIENCE, au sein de l'équipe R&D NETVIBES.",
    highlights: [
      "Fonctionnalités de recherche avancées sur de fortes volumétries",
      "Travail continu sur la performance et l'expérience utilisateur",
      "Projets internationaux, environnement Agile et R&D",
      "Écosystème CATIA, SOLIDWORKS, SIMULIA, DELMIA, ENOVIA, BIOVIA",
    ],
    stack: ["TypeScript", "JavaScript", "Search", "UX", "Agile", "R&D"],
    major: true,
  },
  {
    period: "2018 — 2020",
    periodLabel: "2018 — 2020",
    year: "2018",
    company: "Dassault Systèmes",
    role: "Développeur Front-End · Alternance",
    summary:
      "Développement d'interfaces et participation à l'évolution de la plateforme 3DSearch, en lien direct avec les équipes produit et design.",
    highlights: [
      "Développement d'interfaces utilisateur",
      "Évolution de la plateforme 3DSearch",
      "Collaboration produit et design",
    ],
    stack: ["JavaScript", "Front-end", "Produit", "Design"],
    major: false,
  },
] as const;

export const ventures = [
  {
    name: "Daylora",
    url: "https://daylora.co/",
    body: "Plateforme SaaS multi-tenant pour les mariages : site invité, gestion des convives, cagnotte.",
  },
  {
    name: "TSELEM Studio",
    url: "https://tselem.studio/",
    body: "Maison de l'image à Kinshasa — photographie, film et direction artistique.",
  },
  {
    name: "Momento Wedding",
    url: "https://momento.wedding/",
    body: "Photographie et films de mariage, entre Kinshasa, Paris et l'international.",
  },
  {
    name: "Cozy Intérieur",
    url: "https://cozyinterieur.com/",
    body: "Studio de design d'intérieur et boutique en ligne.",
  },
] as const;

export const references = [
  "Ville de Lille",
  "Dassault Systèmes",
  "NETVIBES",
  "Capgemini",
  "Decathlon",
  "Hewani",
] as const;

export const languages = [
  { name: "Français", level: "Natif" },
  { name: "Lingala", level: "Natif" },
  { name: "Anglais", level: "Professionnel" },
] as const;

export const contactLines = ["Une idée ?", "Construisons-la."] as const;
